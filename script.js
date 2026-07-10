/* ==========================================================================
   Punjab Probation & Parole Service Interactive Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. Theme Toggle Controller --- */
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');
    const body = document.body;

    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.replace('light-mode', 'dark-mode');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.replace('light-mode', 'dark-mode');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.replace('dark-mode', 'light-mode');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
            localStorage.setItem('theme', 'light');
        }
    });


    /* --- 2. Navbar Scrolling Effects --- */
    const navbar = document.getElementById('main-navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    /* --- 3. Mobile Navigation Menu Toggle --- */
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-btn');

    mobileMenuToggle.addEventListener('click', () => {
        mobileDrawer.classList.toggle('open');
        // Toggle hamburger visual effect
        mobileMenuToggle.classList.toggle('active');
        const spans = mobileMenuToggle.querySelectorAll('span');
        if (mobileDrawer.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close drawer when link clicked
    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileDrawer.classList.remove('open');
            mobileMenuToggle.classList.remove('active');
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });


    /* --- 4. Services Tab Toggler --- */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active to current
            btn.classList.add('active');
            const targetPaneId = btn.id === 'tab-probation-btn' ? 'pane-probation' : 'pane-parole';
            document.getElementById(targetPaneId).classList.add('active');
        });
    });


    /* --- 5. Case Eligibility Estimator Logic --- */
    const estimatorForm = document.getElementById('estimator-form');
    const estimatorResult = document.getElementById('estimator-result');
    const resetEstimator = document.getElementById('reset-estimator');
    
    const estimatorType = document.getElementById('estimator-type');
    const groupSentenceServed = document.getElementById('group-sentence-served');

    // Dynamic field visibility based on Probation vs Parole
    estimatorType.addEventListener('change', () => {
        if (estimatorType.value === 'parole') {
            groupSentenceServed.style.display = 'flex';
            document.getElementById('sentence-served').setAttribute('required', 'true');
        } else {
            groupSentenceServed.style.display = 'none';
            document.getElementById('sentence-served').removeAttribute('required');
        }
    });

    estimatorForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const type = estimatorType.value;
        const offense = document.getElementById('offense-type').value;
        const conduct = document.getElementById('offender-conduct').value;
        const sentenceServed = document.getElementById('sentence-served').value;

        let isEligible = 'ineligible';
        let title = 'Ineligible / Unlikely Recommendation';
        let desc = 'Based on provided parameters, the case does not satisfy primary statutory criteria. Offenders of serious offenses or poor conduct are restricted.';

        if (conduct === 'poor') {
            isEligible = 'ineligible';
            title = 'Ineligible due to Conduct';
            desc = 'Good prison conduct or community character is an absolute statutory prerequisite for both probation recommendations and executive parole releases.';
        } else if (offense === 'serious') {
            isEligible = 'review';
            title = 'High Risk - Parole Board Review Required';
            desc = 'Serious or heinous offences are not eligible for standard probation. Parole release remains subject to judicial authorization and high-level Parole Board review.';
        } else {
            if (type === 'probation') {
                if (offense === 'minor' && conduct === 'excellent') {
                    isEligible = 'eligible';
                    title = 'Highly Eligible Recommendation';
                    desc = 'Excellent candidate for judicial probation. The court may defer custodial sentencing and assign a supervising officer in the local district.';
                } else if (offense === 'minor' || offense === 'medium') {
                    isEligible = 'review';
                    title = 'Conditionally Eligible (Social Report Required)';
                    desc = 'Eligible for probation consideration. The magistrate will require a Social Investigation Report (SIR) from the District Probation Officer.';
                }
            } else if (type === 'parole') {
                if (sentenceServed === 'less-third') {
                    isEligible = 'ineligible';
                    title = 'Statutory Prison Duration Not Served';
                    desc = 'Parole guidelines require a prisoner to serve at least 1/3rd or 1/2 of their substantive term before executive release assessments can occur.';
                } else if (sentenceServed === 'more-half' && conduct === 'excellent') {
                    isEligible = 'eligible';
                    title = 'Highly Eligible for Parole';
                    desc = 'Strong release case. Meets the time served constraints and exhibits excellent reform indicators. Subject to jail superintendent certificate and board review.';
                } else if (sentenceServed === 'third-half' || sentenceServed === 'more-half') {
                    isEligible = 'review';
                    title = 'Eligible for Board Auditing';
                    desc = 'Fulfills time-served parameters. Final approval requires standard conduct verification, local police verification, and a surety agreement from a guardian.';
                }
            }
        }

        // Apply classes and text to result card
        const badge = document.getElementById('result-status-badge');
        badge.className = 'result-badge'; // Reset classes
        
        if (isEligible === 'eligible') {
            badge.classList.add('badge-success');
            badge.textContent = 'Eligible';
        } else if (isEligible === 'review') {
            badge.classList.add('badge-warning');
            badge.textContent = 'Under Review';
        } else {
            badge.classList.add('badge-danger');
            badge.textContent = 'Ineligible';
        }

        document.getElementById('result-status-title').textContent = title;
        document.getElementById('result-status-desc').textContent = desc;

        // Animate visibility switch
        estimatorForm.style.display = 'none';
        estimatorResult.style.display = 'block';
    });

    resetEstimator.addEventListener('click', () => {
        estimatorForm.reset();
        groupSentenceServed.style.display = 'none';
        document.getElementById('sentence-served').removeAttribute('required');
        estimatorResult.style.display = 'none';
        estimatorForm.style.display = 'flex';
    });

    /* --- 7. Contact / Inquiry Form Controller --- */
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Hide form fields & display nice animations
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';
    });


    /* --- 8. Dynamic Scroll Reveal Effects --- */
    const revealElements = document.querySelectorAll('.scroll-reveal, .metric-card, .timeline-item');
    
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;

        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Initial run for elements in view on load
    revealOnScroll();


    /* --- 9. Count-up Stats Animation --- */
    const statsNumbers = document.querySelectorAll('.metric-num');
    
    const animateCounts = () => {
        statsNumbers.forEach(stat => {
            const value = parseFloat(stat.getAttribute('data-val'));
            const isPercent = stat.textContent.includes('%');
            const isPlus = stat.textContent.includes('+');
            const isMillions = stat.textContent.includes('M+');
            
            let current = 0;
            let increment = Math.ceil(value / 100);
            if (value === 92) increment = 1; // slow decimal rate
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= value) {
                    current = value;
                    clearInterval(timer);
                }
                
                if (isPercent) {
                    stat.textContent = `${current}%`;
                } else if (isMillions) {
                    stat.textContent = '1.25M+';
                } else if (isPlus) {
                    stat.textContent = `${current.toLocaleString()}+`;
                } else {
                    stat.textContent = current.toLocaleString();
                }
            }, 15);
        });
    };

    // Trigger metrics counts animation when section scrolled into view
    const overviewSection = document.getElementById('overview');
    let animated = false;

    const checkStatsScroll = () => {
        if (!overviewSection) return;
        const rect = overviewSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && !animated) {
            animateCounts();
            animated = true;
            window.removeEventListener('scroll', checkStatsScroll);
        }
    };

    window.addEventListener('scroll', checkStatsScroll);
    checkStatsScroll(); // check once initially

});
