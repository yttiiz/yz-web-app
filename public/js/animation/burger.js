export const handleBurger = () => {
    const burger = document.querySelector('#burger');
    
    burger.addEventListener('click', (e, i = 0) => {
        const lines = e.currentTarget.querySelectorAll('button > span');
        const nav = e.currentTarget.querySelector('nav');

        for (const line of lines) {
            line.classList.toggle(`line-${i + 1}`);
            i++
        }
        nav.classList.toggle('none');
    });
}