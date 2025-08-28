// Retroverse Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.about-card, .feature-item, .community-content, .join-content');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Dynamic pixel generation
    function createFloatingPixel() {
        const pixel = document.createElement('div');
        pixel.className = 'floating-pixel';
        pixel.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: ${getRandomColor()};
            pointer-events: none;
            z-index: 1;
            left: ${Math.random() * window.innerWidth}px;
            top: ${window.innerHeight}px;
            animation: floatUp ${3 + Math.random() * 4}s linear forwards;
        `;
        
        document.body.appendChild(pixel);
        
        // Remove pixel after animation
        setTimeout(() => {
            if (pixel.parentNode) {
                pixel.parentNode.removeChild(pixel);
            }
        }, 7000);
    }

    function getRandomColor() {
        const colors = ['#6B46C1', '#8B5CF6', '#A855F7', '#06B6D4', '#EC4899', '#10B981'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Create floating pixels periodically
    setInterval(createFloatingPixel, 2000);

    // Glitch effect enhancement
    function enhanceGlitchEffect() {
        const glitchElements = document.querySelectorAll('.glitch');
        
        glitchElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.animation = 'none';
                this.offsetHeight; // Trigger reflow
                this.style.animation = 'glitch-intense 0.3s ease-in-out';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.animation = '';
            });
        });
    }

    enhanceGlitchEffect();

    // Parallax effect for background elements
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.color-blocks .block');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Typing effect for hero title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Initialize typing effect on page load
    const heroTitle = document.querySelector('.title-brand');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 1000);
    }

    // Stats counter animation
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // Discord API Integration with Multiple Methods
    async function fetchDiscordStats() {
        try {
            // Method 1: Try Discord Widget API
            const serverID = '1410707278356807875';
            const widgetResponse = await fetch(`https://discord.com/api/guilds/${serverID}/widget.json`);

            if (widgetResponse.ok) {
                const data = await widgetResponse.json();
                console.log('✅ Discord Widget API working!', data);
                return {
                    memberCount: data.presence_count || data.approximate_member_count || 0,
                    onlineCount: data.presence_count || 0
                };
            }
        } catch (error) {
            console.log('Discord Widget API not available, trying invite method...');
        }

        try {
            // Method 2: Discord Invite API (works without widget!)
            // Using your actual Discord invite code
            const inviteCode = 'zFsJHx52SQ'; // Your Retroverse invite code
            const inviteResponse = await fetch(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`);

            if (inviteResponse.ok) {
                const data = await inviteResponse.json();
                console.log('✅ Discord Invite API working!', data);
                return {
                    memberCount: data.approximate_member_count || 0,
                    onlineCount: data.approximate_presence_count || 0
                };
            }
        } catch (error) {
            console.log('Discord Invite API not available either');
        }

        try {
            // Method 3: Try Discord Lookup Services
            const lookupResponse = await fetch(`https://discordlookup.mesalytic.moe/v1/guild/${serverID}`);

            if (lookupResponse.ok) {
                const data = await lookupResponse.json();
                console.log('✅ Discord Lookup API working!', data);
                return {
                    memberCount: data.memberCount || data.approximate_member_count || 0,
                    onlineCount: data.onlineCount || data.presence_count || 0
                };
            }
        } catch (error) {
            console.log('Discord Lookup API not available');
        }

        // Method 4: Check for manually updated stats in localStorage
        const savedStats = localStorage.getItem('retroverse-stats');
        if (savedStats) {
            const stats = JSON.parse(savedStats);
            console.log('✅ Using manually updated stats from localStorage', stats);
            return {
                memberCount: stats.memberCount,
                onlineCount: stats.onlineCount
            };
        }

        // Method 5: Final fallback with realistic numbers
        console.log('Using default fallback numbers - use update-stats.html to set real numbers');
        return {
            memberCount: 1250, // Update this manually with your current member count
            onlineCount: 180   // Update this with typical online count
        };
    }

    // Animate stats when they come into view
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(async entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                const discordStats = await fetchDiscordStats();

                statNumbers.forEach((stat, index) => {
                    const text = stat.textContent;
                    let targetNumber;

                    // Update with live Discord data
                    if (index === 0) { // First stat - member count
                        targetNumber = discordStats.memberCount;
                        animateCounter(stat, targetNumber);
                        stat.textContent = targetNumber + '+';
                    } else if (text.includes('+')) {
                        const number = parseInt(text.replace('+', ''));
                        animateCounter(stat, number);
                        stat.textContent = number + '+';
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const communityStats = document.querySelector('.community-stats');
    if (communityStats) {
        statsObserver.observe(communityStats);
    }

    // Discord preview message animation
    function animateDiscordMessages() {
        const messages = document.querySelectorAll('.message');
        messages.forEach((message, index) => {
            message.style.opacity = '0';
            message.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                message.style.transition = 'all 0.5s ease';
                message.style.opacity = '1';
                message.style.transform = 'translateY(0)';
            }, index * 500 + 1000);
        });
    }

    // Trigger Discord animation when community section is visible
    const communityObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateDiscordMessages();
                communityObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const communitySection = document.querySelector('.community');
    if (communitySection) {
        communityObserver.observe(communitySection);
    }

    // Add CSS for floating pixels animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% {
                opacity: 0;
                transform: translateY(0) rotate(0deg);
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                opacity: 0;
                transform: translateY(-100vh) rotate(360deg);
            }
        }
        
        @keyframes glitch-intense {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
        }
        
        .animate-in {
            animation: slideInUp 0.8s ease-out forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .navbar.scrolled {
            background: rgba(15, 15, 35, 0.98);
            backdrop-filter: blur(20px);
        }
        
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                top: 70px;
                right: -100%;
                width: 100%;
                height: calc(100vh - 70px);
                background: rgba(15, 15, 35, 0.98);
                backdrop-filter: blur(20px);
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                padding-top: 2rem;
                transition: right 0.3s ease;
            }
            
            .nav-menu.active {
                right: 0;
            }
            
            .hamburger.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            
            .hamburger.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        }
    `;
    document.head.appendChild(style);

    console.log('🎮 Retroverse loaded successfully! Welcome to the future of retro gaming.');
});
