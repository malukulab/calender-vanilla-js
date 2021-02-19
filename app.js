window.addEventListener('DOMContentLoaded', () => {

  calendar({
    showToday: true,
    dataEvents: [
      new Date(2021, 1).toLocaleDateString(),
      new Date(2021, 1).toLocaleDateString(),
      new Date(2021, 2).toLocaleDateString()
    ],
    showNotThisMonth: true,
    headings: {
      days: [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"
      ],
      weekend: 'minggu'
    },
    events: {
      prevOnClick: (ev) => {
        console.log(ev);
        console.log('onClick prev')

        el('#event-prev-on-click').innerText = ev.toLocaleDateString();
        el('#event-prev-on-click').animate({
          backgroundColor: 'rgb(117, 255, 110)'
        }, 200);
      },
      nextOnClick: (ev) => {
        console.log(ev);
        console.log('onClick next')

        el('#event-next-on-click').innerText = ev.toLocaleDateString();
        el('#event-next-on-click').animate({
          backgroundColor: 'rgb(183, 206, 255)'
        }, 200);
      },
      onClick: (ev) => {
        console.log(ev);
        console.log('onClick Date')

        el('#event-on-click').innerText = ev.toLocaleDateString();
        el('#event-on-click').animate({
          backgroundColor: 'rgb(200, 120, 200)'
        }, 200);
      }
    }
  });



  function calendar({
    headings,
    currentDate,
    events,
    showToday,
    showNotThisMonth,
    dataEvents
  }) {
    const headingsCalendar = headings;
    const view = build("[calendar-container]");
    let state = {
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    }

    view.heading();

    view.render(
      currentDate || new Date(state.year, state.month + 1, 0), // current month.
    );


    function hasDataEventCount(date) {
      let count = 0;

      for (const it of dataEvents.values()) {
        if (it === date.toLocaleDateString()) {
          count++;
        }
      }

      return count;
    }

    /**
     * Build calendar base view.
     *
     * @param {HTMLElement} _view
     */
    function build(_view) {
      const element = el(_view, 0);
      const listOfMonths = headingsCalendar.months || [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember'
      ];

      function heading() {
        const head = element.children[0];
        const weekend = headingsCalendar.weekend;

        append(head, () => {
          const rows = headingsCalendar.days.map(_day =>  {
            return `<th scope="head-month" ${_day.toLowerCase() === weekend ? 'calendar-monday' : ''}>${_day}</th>`;
          }).join('');

          return `<tr>${rows}</tr>`;
        });
      }

      function render(_currentDate) {
        const dates = [];
        element.children[1].innerHTML = ''; // clear this content body before rendering.
        const today = new Date();
        const totalDaysInMonth = _currentDate.getDate();
        const todayInMonth = today.getMonth();
        const todayInYear = today.getFullYear();
        const currentInMonth = _currentDate.getMonth();
        const currentInYear = _currentDate.getFullYear();
        const currentMonthTitle = listOfMonths[currentInMonth];
        const totalDaysInPrevMonth = new Date(currentInYear, currentInMonth).getDay();


        el('[calendar-monthTitle]', 0).textContent = `${currentMonthTitle} ${currentInYear}`;

        for (let i = 1; i <= totalDaysInPrevMonth; i++) {
          dates.push({
            day: showNotThisMonth ? i : '',
            date: new Date(currentInYear, (currentInMonth - 1), i),
            thisMonthClass: 'not-current__month',
            isToday: false
          });
        }


        for (let i = 1; i <= totalDaysInMonth; i++) {
          const isToday = equal(i === today.getDate())
            .equal(_currentDate.getMonth() === todayInMonth)
            .equal(_currentDate.getFullYear() === todayInYear)
            .get;

          dates.push({
            day: i,
            date: new Date(currentInYear, currentInMonth, i),
            thisMonthClass: 'current__month',
            isToday: showToday ? isToday : false
          });
        }

        const totalDaysInNextMonth = 42 - dates.length; // num of calendar grids (td).
        const totalRows = Math.ceil(dates.length / 7);

        for (let i = 1; i <= totalDaysInNextMonth; i++) {
          dates.push({
            day: showNotThisMonth ? i : '',
            date: new Date(currentInYear, currentInMonth + 1, i),
            thisMonthClass: 'not-current__month',
            isToday: false
          });
        }

        const tdElements = dates.map(({day, isToday, thisMonthClass: monthClass, date} )=> {
          const tdElement = createElement('td');

          tdElement.classList.add(monthClass);
          tdElement.innerText = day || '';

          if (isToday) {
            tdElement.classList.add('current__today');
            tdElement.setAttribute('today', day);
          }

          const count = hasDataEventCount(date);
          if (count > 0) {
            tdElement.setAttribute('calendar-event-count', count > 99 ? '99+' : count + 1);
          }

          if ('onClick' in events) {
            tdElement.addEventListener('click', () => events.onClick(date));
          }

          return tdElement;
        });

        for (let i = 0; i < totalRows; i++) {
          const trElement = createElement('tr');

          for (let j = 0; j < 7; j++) {
            trElement.insertAdjacentElement('beforeend', tdElements.shift());
          }

          element.children[1].insertAdjacentElement('beforeend', trElement);
        }
      }

      return {
        heading,
        render
      };
    }



    el('button[calendar-btn-prev]', 0)?.addEventListener('click', () => {
      const date = new Date(state.year, state.month, 0);
      state.month = date.getMonth();
      state.year = date.getFullYear();

      view.render(
        date
      );

      events?.prevOnClick(new Date(state.year, state.month));
    });

    el('button[calendar-btn-next]', 0)?.addEventListener('click', () => {
      const date = new Date(state.year, state.month + 2, 0);
      state.month = date.getMonth();
      state.year = date.getFullYear();

      view.render(
        date
      );

      events?.nextOnClick(new Date(state.year, state.month));
    });

  }


  function append(parent, callback) {
    parent.innerHTML = typeof callback === 'function' ? callback() : callback;
  }

  function getLastChildren(element) {
    if (element.children.length === 0) return element;

    const child = getLastChildren(element.children[0]);


    return child;
  }

  function equal(statment) {
    const result = [];

    return function equalInDive(_statment) {
      result.push(_statment ? true : false);

      return {
        equal: equalInDive,
        get: !result.includes(false)
      }
    }(statment);
  }

  function el(sel, index) {
    const elements = document.querySelectorAll(sel);

    if (elements === undefined) {
      throw new Error('Element selector not found');
    }

    if (typeof index === 'number' ) {
      return elements[index];
    }

    if (elements.length > 1) return elements;

    return elements[0];
  }

  function createElement(element) {
    return document.createElement(element);
  }

  // function hasEqualDate(dates, date) {
  //   if (!Array.isArray(dates)) {
  //     console.log(dates);
  //     return (dates.getMonth() === date.getMonth())
  //       && (dates.getYear() === date.getYear())
  //       && (dates.getDay() === date.getDay());
  //   }

  //   function* forEachGenerator(_dates) {
  //     yield* _dates;
  //   }

  //   const has = forEachGenerator(dates);
  //   console.log('d');
  //   console.log(dates);
  //   // console.log(has.next().done);
  //   // console.log(has.next().done);
  //   // while (!has.next().done) {
  //   //   const value = has.next().value;
  //   //   console.log(value);
  //   //   if (hasEqualDate(value, date)) return true;
  //   // }

  //   return false;
  // }

});
