const buttons = [...document.querySelectorAll('.filter')];
const projects = [...document.querySelectorAll('.project')];
const status = document.querySelector('#filter-status');

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    buttons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    let visibleCount = 0;

    projects.forEach((project) => {
      const categories = project.dataset.category.split(' ');
      const visible = filter === 'all' || categories.includes(filter);
      project.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    status.textContent = `${visibleCount} project${visibleCount === 1 ? '' : 's'} shown`;
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();