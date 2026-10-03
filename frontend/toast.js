// ========================================
// LPU SOCIAL - TOAST NOTIFICATION SYSTEM
// ========================================

(function () {
    // Inject Toast container if not present
    function initToastContainer() {
        if (!document.getElementById("toastContainer")) {
            const container = document.createElement("div");
            container.id = "toastContainer";
            container.style.cssText = `
                position: fixed;
                top: 24px;
                right: 24px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 12px;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
    }

    window.showToast = function (message, type = "info", duration = 4000) {
        initToastContainer();
        const container = document.getElementById("toastContainer");

        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        
        let icon = "ℹ️";
        let borderColor = "#6c4ce8";
        let bgGradient = "linear-gradient(135deg, #17132B, #251F45)";

        if (type === "success") {
            icon = "✅";
            borderColor = "#10B981";
        } else if (type === "error") {
            icon = "❌";
            borderColor = "#EF4444";
        } else if (type === "warning") {
            icon = "⚠️";
            borderColor = "#F59E0B";
        }

        toast.style.cssText = `
            pointer-events: auto;
            min-width: 280px;
            max-width: 380px;
            background: ${bgGradient};
            color: #ffffff;
            padding: 14px 20px;
            border-radius: 12px;
            border-left: 4px solid ${borderColor};
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            font-family: 'Inter', sans-serif;
            font-size: 0.92rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 12px;
            opacity: 0;
            transform: translateX(40px) scale(0.95);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        `;

        toast.innerHTML = `
            <span style="font-size: 1.2rem;">${icon}</span>
            <span style="flex: 1;">${message}</span>
            <button style="background: none; border: none; color: #9CA3AF; cursor: pointer; font-size: 1.1rem; padding: 0 4px;" onclick="this.parentElement.remove()">✕</button>
        `;

        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateX(0) scale(1)";
        });

        // Auto remove
        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(40px) scale(0.95)";
            setTimeout(() => toast.remove(), 300);
        }, duration);
    };
})();
