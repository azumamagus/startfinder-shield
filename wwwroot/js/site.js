/**
 * Starfinder Shield - Sidebar Control
 * Usa event delegation para funcionar mesmo com re-renders do Blazor
 */

(function() {
    'use strict';

    console.log('🚀 Sidebar script loaded');

    // Funções de controle do sidebar
    const openSidebar = () => {
        console.log('📂 Opening sidebar');
        const sidebar = document.getElementById("sidebar");
        const overlay = document.getElementById("sidebarOverlay");

        if (!sidebar) {
            console.error('❌ Sidebar element not found!');
            return;
        }

        sidebar.classList.add("show");
        sidebar.classList.remove("hidden");
        if (overlay) overlay.classList.add("active");
        document.body.style.overflow = 'hidden';
        console.log('✅ Sidebar opened, classes:', sidebar.className);
    };

    const closeSidebar = () => {
        console.log('📁 Closing sidebar');
        const sidebar = document.getElementById("sidebar");
        const overlay = document.getElementById("sidebarOverlay");

        if (!sidebar) {
            console.error('❌ Sidebar element not found!');
            return;
        }

        sidebar.classList.remove("show");
        if (window.innerWidth < 992) {
            sidebar.classList.add("hidden");
        }
        if (overlay) overlay.classList.remove("active");
        document.body.style.overflow = '';
        console.log('✅ Sidebar closed, classes:', sidebar.className);
    };

    const toggleDesktopSidebar = () => {
        console.log('🔄 Toggling desktop sidebar');
        const sidebar = document.getElementById("sidebar");
        const mainArea = document.querySelector('.main-area');

        if (!sidebar) {
            console.error('❌ Sidebar element not found!');
            return;
        }

        sidebar.classList.toggle('hidden');

        // Ajustar margem do main-area
        if (mainArea && window.innerWidth >= 992) {
            if (sidebar.classList.contains('hidden')) {
                mainArea.style.marginLeft = '0';
                console.log('📏 Main area margin removed');
            } else {
                mainArea.style.marginLeft = 'var(--sidebar-width)';
                console.log('📏 Main area margin restored');
            }
        }

        console.log('✅ Sidebar toggled, classes:', sidebar.className);
    };

    // Event delegation no document para funcionar com Blazor re-renders
    document.addEventListener('click', (e) => {
        // Botão abrir sidebar (mobile)
        if (e.target.closest('#openSidebar')) {
            console.log('🔘 Open button clicked');
            e.preventDefault();
            e.stopPropagation();
            openSidebar();
            return;
        }

        // Botão fechar sidebar (mobile)
        if (e.target.closest('#closeSidebar')) {
            console.log('🔘 Close button clicked');
            e.preventDefault();
            e.stopPropagation();
            closeSidebar();
            return;
        }

        // Toggle sidebar (desktop)
        if (e.target.closest('#toggleSidebarDesktop')) {
            console.log('🔘 Toggle desktop button clicked');
            e.preventDefault();
            e.stopPropagation();
            toggleDesktopSidebar();
            return;
        }

        // Overlay (fechar ao clicar fora)
        if (e.target.id === 'sidebarOverlay' || e.target.closest('#sidebarOverlay')) {
            console.log('🔘 Overlay clicked');
            e.preventDefault();
            e.stopPropagation();
            closeSidebar();
            return;
        }
    }, true);

    // Inicializar estado do sidebar no carregamento e resize
    const initializeSidebarState = () => {
        const sidebar = document.getElementById("sidebar");
        const overlay = document.getElementById("sidebarOverlay");

        if (!sidebar) {
            console.warn('⚠️ Sidebar not found during init');
            return;
        }

        console.log('🔧 Initializing sidebar state, viewport width:', window.innerWidth);

        if (window.innerWidth >= 992) {
            // Desktop: sidebar visível por padrão
            sidebar.classList.remove('hidden');
            sidebar.classList.remove('show');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
            console.log('💻 Desktop mode - sidebar visible');
        } else {
            // Mobile: sidebar escondido por padrão
            sidebar.classList.add('hidden');
            sidebar.classList.remove('show');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
            console.log('📱 Mobile mode - sidebar hidden');
        }

        console.log('✅ Sidebar initialized, classes:', sidebar.className);
    };

    // Executar quando DOM estiver pronto
    // Aguardar um pouco para garantir que Blazor renderizou
    const initWhenReady = () => {
        if (document.getElementById('sidebar')) {
            console.log('✅ Sidebar found, initializing...');
            initializeSidebarState();
        } else {
            console.log('⏳ Waiting for sidebar to render...');
            setTimeout(initWhenReady, 100);
        }
    };

    if (document.readyState === 'loading') {
        console.log('📄 DOM still loading, waiting...');
        document.addEventListener('DOMContentLoaded', initWhenReady);
    } else {
        console.log('📄 DOM already loaded, initializing...');
        initWhenReady();
    }

    // Re-inicializar no resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const sidebar = document.getElementById("sidebar");
            if (!sidebar) return;

            // Se mudar de mobile para desktop ou vice-versa
            const wasMobile = sidebar.classList.contains('show') || sidebar.classList.contains('hidden');
            const isMobile = window.innerWidth < 992;

            if (wasMobile !== isMobile) {
                initializeSidebarState();
            }
        }, 150);
    });

    // Observer para detectar quando Blazor adiciona elementos
    // e reinicializar se necessário
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.id === 'sidebar' || (node.querySelector && node.querySelector('#sidebar'))) {
                        // Sidebar foi re-adicionado ao DOM pelo Blazor
                        setTimeout(initializeSidebarState, 50);
                    }
                });
            }
        });
    });

    // Observar mudanças no body
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
