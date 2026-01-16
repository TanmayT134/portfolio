(function () {
    emailjs.init("depUJCP7Ws866a8hC");
})();

let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

const readMoreBtn = document.getElementById('readMoreBtn');
const moreText = document.querySelector('.more-text');

readMoreBtn.addEventListener('click', () => {
    moreText.classList.toggle('show');
    readMoreBtn.textContent =
        moreText.classList.contains('show') ? 'Read Less' : 'Read More';
});


let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 100;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });

            sec.classList.add('show-animate');
        }
        else {
            sec.classList.remove('show-animate');
        }
    });

    let header = document.querySelector('header');

    header.classList.toggle('sticky', window.scrollY > 100);

    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');

    let footer = document.querySelector('footer');

    footer.classList.toggle('show-animate', this.innerHeight + this.scrollY >= document.scrollingElement.scrollHeight);
}

const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    emailjs.sendForm(
        'service_tt4debm',
        'template_oq029u6',
        this
    )
    .then(() => {
        alert('Message sent successfully!');
        contactForm.reset();
    })
    .catch((error) => {
        console.error('EmailJS Error:', error);
        alert('Something went wrong. Please try again.');
    });
});
