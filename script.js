/* ==========================================================================
   საბა მჭედლიშვილის პორტფოლიო - JavaScript ფუნქციონალი
   1. Light / Dark თემის გადართვა და შენახვა (localStorage)
   2. მობილური ბურგერ მენიუს სრული მართვა (JavaScript)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // 1. Light / Dark თემის მართვა
    // ==========================================
    var themeToggleBtn = document.getElementById('theme-toggle');

    // საწყისი თემის მოძიება: ჯერ localStorage, შემდეგ ბრაუზერის/სისტემის პარამეტრები
    function getStoredTheme() {
        var saved = localStorage.getItem('portfolio-theme');
        if (saved === 'dark' || saved === 'light') {
            return saved;
        }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // თემის გააქტიურების ფუნქცია
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-theme');
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.body.classList.remove('dark-theme');
        }
        localStorage.setItem('portfolio-theme', theme);

        if (themeToggleBtn) {
            var isDark = (theme === 'dark');
            themeToggleBtn.setAttribute('aria-label', isDark ? 'სინათლის (Light) თემაზე გადართვა' : 'ბნელ (Dark) თემაზე გადართვა');
            themeToggleBtn.setAttribute('title', isDark ? 'Light რეჟიმი' : 'Dark რეჟიმი');
        }
    }

    // საწყისად თემის მინიჭება
    applyTheme(getStoredTheme());

    // თემის გადამრთველ ღილაკზე დაჭერა
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function () {
            var isDark = document.documentElement.getAttribute('data-theme') === 'dark' || document.body.classList.contains('dark-theme');
            applyTheme(isDark ? 'light' : 'dark');
        });
    }

    // ==========================================
    // 2. მობილური ბურგერ მენიუს მართვა (JavaScript)
    // ==========================================
    var burgerBtn = document.getElementById('burger-btn');
    var mainNav = document.getElementById('main-nav');
    var navLinks = document.querySelectorAll('#main-nav a');

    if (burgerBtn && mainNav) {
        // ბურგერ ღილაკზე დაჭერისას ნავიგაციის ელემენტების გამოჩენა / დამალვა
        burgerBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleMobileNav();
        });

        // კლავიატურით (Enter / Space) მართვა
        burgerBtn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileNav();
            }
        });

        function toggleMobileNav() {
            var isOpen = mainNav.classList.toggle('is-open');
            burgerBtn.classList.toggle('is-active', isOpen);
            burgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            burgerBtn.setAttribute('aria-label', isOpen ? 'ნავიგაციის მენიუს დახურვა' : 'ნავიგაციის მენიუს გახსნა');
        }

        function closeMobileNav() {
            if (mainNav.classList.contains('is-open')) {
                mainNav.classList.remove('is-open');
                burgerBtn.classList.remove('is-active');
                burgerBtn.setAttribute('aria-expanded', 'false');
                burgerBtn.setAttribute('aria-label', 'ნავიგაციის მენიუს გახსნა');
            }
        }

        // ==========================================
        // 3. სექციების გაფილტვრა / ცალკე ჩვენება
        // ==========================================
        var allSections = document.querySelectorAll('main section');
        var footerNavButtons = document.querySelectorAll('.section-footer-nav');
        var brandLink = document.querySelector('.brand-link');

        function showSection(filter) {
            var target = (!filter || filter === 'all' || filter === '#all') ? 'all' : filter.replace('#', '');

            if (target === 'all') {
                allSections.forEach(function (sec) {
                    sec.style.display = 'block';
                });

                footerNavButtons.forEach(function (footerBox) {
                    footerBox.style.display = 'none';
                });

                navLinks.forEach(function (link) {
                    if (link.getAttribute('data-filter') === 'all') {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                try {
                    history.replaceState(null, '', '#all');
                } catch (err) {}
            } else {
                var selectedSection = document.getElementById(target);
                if (selectedSection) {
                    allSections.forEach(function (sec) {
                        if (sec.id === target) {
                            sec.style.display = 'block';
                        } else {
                            sec.style.display = 'none';
                        }
                    });

                    footerNavButtons.forEach(function (footerBox) {
                        if (footerBox.closest('section') === selectedSection) {
                            footerBox.style.display = 'block';
                        } else {
                            footerBox.style.display = 'none';
                        }
                    });

                    navLinks.forEach(function (link) {
                        if (link.getAttribute('data-filter') === target) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });

                    try {
                        history.replaceState(null, '', '#' + target);
                    } catch (err) {}
                }
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        navLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                var filter = link.getAttribute('data-filter');
                if (filter) {
                    e.preventDefault();
                    showSection(filter);
                    closeMobileNav();
                }
            });
        });

        document.querySelectorAll('.btn-show-all').forEach(function (btn) {
            btn.addEventListener('click', function () {
                showSection('all');
            });
        });

        if (brandLink) {
            brandLink.addEventListener('click', function (e) {
                e.preventDefault();
                showSection('all');
            });
        }

        var currentHash = window.location.hash ? window.location.hash.replace('#', '') : 'all';
        if (['about', 'skills', 'projects', 'employees', 'goals', 'contact'].indexOf(currentHash) !== -1) {
            showSection(currentHash);
        } else {
            showSection('all');
        }

        window.addEventListener('hashchange', function () {
            var hash = window.location.hash ? window.location.hash.replace('#', '') : 'all';
            showSection(hash);
        });

        // ==========================================
        // 4. თანამშრომლების მართვა (JSONPlaceholder API: GET, POST, DELETE)
        // ==========================================
        var employeesLoaded = false;
        var employeesList = [];

        function escapeHtml(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        function showEmployeeAlert(msg, type) {
            var alertBox = document.getElementById('employees-alert');
            if (!alertBox) return;
            alertBox.textContent = msg;
            alertBox.className = 'employees-alert ' + (type || 'info');
            alertBox.style.display = 'flex';
            setTimeout(function () {
                alertBox.style.display = 'none';
            }, 5000);
        }

        function loadEmployees() {
            if (employeesLoaded) return;
            var grid = document.getElementById('employees-grid');
            var loading = document.getElementById('employees-loading');
            if (!grid) return;

            // HTTP GET მეთოდი - მონაცემების წამოღება სერვერიდან
            fetch('https://jsonplaceholder.typicode.com/users')
                .then(function (response) {
                    if (!response.ok) throw new Error('ქსელის შეცდომა');
                    return response.json();
                })
                .then(function (users) {
                    employeesList = users;
                    employeesLoaded = true;
                    if (loading) loading.style.display = 'none';
                    renderEmployees(employeesList);
                })
                .catch(function (error) {
                    if (loading) {
                        loading.innerHTML = '<p style="color: #c62828;">ვერ მოხერხდა თანამშრომლების ჩატვირთვა. გთხოვთ შეამოწმოთ ინტერნეტის კავშირი.</p>';
                    }
                });
        }

        function renderEmployees(users) {
            var grid = document.getElementById('employees-grid');
            if (!grid) return;
            grid.innerHTML = '';

            if (!users || users.length === 0) {
                grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 25px;">თანამშრომელი ვერ მოიძებნა.</p>';
                return;
            }

            users.forEach(function (user) {
                var initials = user.name ? user.name.split(' ').map(function(n){ return n[0]; }).slice(0, 2).join('') : 'U';
                var companyName = (user.company && user.company.name) ? user.company.name : 'დამოუკიდებელი';
                var city = (user.address && user.address.city) ? user.address.city : '';

                var card = document.createElement('div');
                card.className = 'employee-card';
                card.setAttribute('data-id', user.id);
                card.innerHTML = 
                    '<div class="employee-header">' +
                        '<div class="employee-avatar">' + initials + '</div>' +
                        '<div class="employee-title">' +
                            '<h3>' + escapeHtml(user.name) + '</h3>' +
                            '<span class="employee-username">@' + escapeHtml(user.username || 'user') + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<ul class="employee-details">' +
                        '<li><strong>კომპანია:</strong> <span class="employee-badge">' + escapeHtml(companyName) + '</span></li>' +
                        '<li><strong>ელ-ფოსტა:</strong> <a href="mailto:' + escapeHtml(user.email) + '">' + escapeHtml(user.email) + '</a></li>' +
                        (user.phone ? '<li><strong>ტელ:</strong> ' + escapeHtml(user.phone) + '</li>' : '') +
                        (city ? '<li><strong>ქალაქი:</strong> ' + escapeHtml(city) + '</li>' : '') +
                    '</ul>' +
                    '<div class="employee-actions">' +
                        '<button type="button" class="btn-delete-emp" data-id="' + user.id + '" title="თანამშრომლის წაშლა (HTTP DELETE)">წაშლა (DELETE)</button>' +
                    '</div>';

                grid.appendChild(card);
            });

            grid.querySelectorAll('.btn-delete-emp').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var id = btn.getAttribute('data-id');
                    deleteEmployee(id);
                });
            });
        }

        // HTTP DELETE მეთოდი
        function deleteEmployee(id) {
            if (!confirm('ნამდვილად გსურთ ამ თანამშრომლის წაშლა?')) return;

            fetch('https://jsonplaceholder.typicode.com/users/' + id, {
                method: 'DELETE'
            })
            .then(function () {
                employeesList = employeesList.filter(function (u) { return String(u.id) !== String(id); });
                renderEmployees(employeesList);
                showEmployeeAlert('თანამშრომელი წაიშალა (HTTP DELETE მოთხოვნა გაიგზავნა წარმატებით)!', 'info');
            })
            .catch(function () {
                showEmployeeAlert('წაშლისას დაფიქსირდა შეცდომა.', 'error');
            });
        }

        // HTTP POST მეთოდი
        var addForm = document.getElementById('add-employee-form');
        var toggleAddBtn = document.getElementById('btn-toggle-add-form');
        var cancelAddBtn = document.getElementById('btn-cancel-add');

        if (toggleAddBtn && addForm) {
            toggleAddBtn.addEventListener('click', function () {
                var isHidden = addForm.style.display === 'none';
                addForm.style.display = isHidden ? 'block' : 'none';
                toggleAddBtn.textContent = isHidden ? '✕ ფორმის დახურვა' : '+ თანამშრომლის დამატება (POST)';
            });
        }

        if (cancelAddBtn && addForm) {
            cancelAddBtn.addEventListener('click', function () {
                addForm.style.display = 'none';
                if (toggleAddBtn) toggleAddBtn.textContent = '+ თანამშრომლის დამატება (POST)';
            });
        }

        if (addForm) {
            addForm.addEventListener('submit', function (e) {
                e.preventDefault();
                var submitBtn = document.getElementById('emp-submit-btn');
                if (submitBtn) submitBtn.disabled = true;

                var nameVal = document.getElementById('emp-name').value.trim();
                var emailVal = document.getElementById('emp-email').value.trim();
                var compVal = document.getElementById('emp-company').value.trim() || 'Tech Studio';
                var cityVal = document.getElementById('emp-city').value.trim() || 'თბილისი';

                var newEmployeeData = {
                    name: nameVal,
                    username: nameVal.toLowerCase().replace(/\s+/g, '_'),
                    email: emailVal,
                    company: { name: compVal },
                    address: { city: cityVal }
                };

                fetch('https://jsonplaceholder.typicode.com/users', {
                    method: 'POST',
                    body: JSON.stringify(newEmployeeData),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                })
                .then(function (response) {
                    return response.json();
                })
                .then(function (createdUser) {
                    createdUser.id = createdUser.id || Date.now();
                    employeesList.unshift(createdUser);
                    renderEmployees(employeesList);

                    addForm.reset();
                    addForm.style.display = 'none';
                    if (toggleAddBtn) toggleAddBtn.textContent = '+ თანამშრომლის დამატება (POST)';
                    showEmployeeAlert('ახალი თანამშრომელი დაემატა (HTTP POST მოთხოვნით)!', 'success');
                })
                .catch(function () {
                    showEmployeeAlert('დამატებისას დაფიქსირდა შეცდომა.', 'error');
                })
                .finally(function () {
                    if (submitBtn) submitBtn.disabled = false;
                });
            });
        }

        // Real-time ძებნა
        var searchInput = document.getElementById('employee-search');
        if (searchInput) {
            searchInput.addEventListener('input', function (e) {
                var q = e.target.value.toLowerCase().trim();
                var filtered = employeesList.filter(function (u) {
                    var n = u.name && u.name.toLowerCase().includes(q);
                    var em = u.email && u.email.toLowerCase().includes(q);
                    var co = u.company && u.company.name && u.company.name.toLowerCase().includes(q);
                    return n || em || co;
                });
                renderEmployees(filtered);
            });
        }

        // თანამშრომლების სიის ავტომატური წამოღება
        loadEmployees();

        // მენიუს გარეთ დაკლიკებისას დახურვა
        document.addEventListener('click', function (e) {
            if (!mainNav.contains(e.target) && !burgerBtn.contains(e.target)) {
                closeMobileNav();
            }
        });

        // Escape ღილაკზე დაჭერისას დახურვა
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeMobileNav();
            }
        });
    }

});
