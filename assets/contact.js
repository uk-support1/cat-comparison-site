(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const fields = [...form.querySelectorAll('input, textarea')];
  const fieldset = form.querySelector('fieldset');
  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById('contact-status');
  const success = document.getElementById('contact-success');
  let sending = false;

  fields.forEach(field => field.addEventListener('input', () => field.setCustomValidity('')));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    fields.forEach(field => {
      field.value = field.value.trim();
      field.setCustomValidity(field.value ? '' : 'この項目を入力してください。');
    });
    if (!form.reportValidity()) return;

    const body = new FormData(form);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    sending = true;
    fieldset.disabled = true;
    form.setAttribute('aria-busy', 'true');
    button.textContent = '送信中…';
    status.dataset.state = 'sending';
    status.textContent = 'お問い合わせを送信しています。';
    try {
      const response = await fetch(form.action, {
        method: 'POST', body, headers: { Accept: 'application/json' }, signal: controller.signal
      });
      if (!response.ok) {
        status.dataset.state = 'error';
        status.textContent = response.status === 429
          ? '送信が混み合っています。少し時間をおいてからお試しください。入力内容は保持されています。'
          : '送信できませんでした。入力内容を確認し、時間をおいて再度お試しください。入力内容は保持されています。';
        return;
      }
      form.reset();
      form.hidden = true;
      status.textContent = '';
      success.hidden = false;
      success.focus();
    } catch {
      status.dataset.state = 'error';
      status.textContent = '送信結果を確認できませんでした。通信状態をご確認ください。入力内容は保持されています。重複送信を避けるため、再送前に少し時間をおいてください。';
    } finally {
      clearTimeout(timeout);
      sending = false;
      fieldset.disabled = false;
      form.removeAttribute('aria-busy');
      button.textContent = '送信する';
    }
  });
})();
