// Toast Notification System
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastConfig {
  message: string;
  type: ToastType;
  duration?: number;
}

class ToastManager {
  private container: HTMLElement | null = null;

  private ensureContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  show({ message, type, duration = 4000 }: ToastConfig) {
    const container = this.ensureContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = this.getIcon(type);
    const messageText = document.createElement('div');
    messageText.textContent = message;
    messageText.style.flex = '1';

    toast.appendChild(icon);
    toast.appendChild(messageText);

    container.appendChild(toast);

    // Auto remove after duration
    setTimeout(() => {
      toast.style.animation = 'slideOut 200ms ease-out';
      setTimeout(() => {
        container.removeChild(toast);
      }, 200);
    }, duration);
  }

  private getIcon(type: ToastType): HTMLElement {
    const icon = document.createElement('div');
    icon.style.cssText = 'width: 20px; height: 20px; flex-shrink: 0;';

    switch (type) {
      case 'success':
        icon.innerHTML = '✓';
        icon.style.cssText += 'color: #10B981; font-weight: bold; font-size: 18px;';
        break;
      case 'error':
        icon.innerHTML = '✕';
        icon.style.cssText += 'color: #EF4444; font-weight: bold; font-size: 18px;';
        break;
      case 'info':
        icon.innerHTML = 'ℹ';
        icon.style.cssText += 'color: #3B82F6; font-weight: bold; font-size: 18px;';
        break;
      case 'warning':
        icon.innerHTML = '⚠';
        icon.style.cssText += 'color: #F59E0B; font-weight: bold; font-size: 18px;';
        break;
    }

    return icon;
  }

  success(message: string) {
    this.show({ message, type: 'success' });
  }

  error(message: string) {
    this.show({ message, type: 'error' });
  }

  info(message: string) {
    this.show({ message, type: 'info' });
  }

  warning(message: string) {
    this.show({ message, type: 'warning' });
  }
}

export const toast = new ToastManager();
