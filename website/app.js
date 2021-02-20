window.addEventListener('DOMContentLoaded', () => {

  calendar({
    showToday: true,
    showAnotherDays: true,
    dataEvents: [
      new Date(2021, 1).toLocaleDateString(),
      new Date(2021, 1).toLocaleDateString(),
      new Date(2021, 2).toLocaleDateString()
    ],
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

});
