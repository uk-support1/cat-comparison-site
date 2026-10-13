/*
 * Browser-local GA4 opt-out for ねこパートナー.
 * This script must be parsed before the Google tag on every tracked page.
 */
(() => {
  const measurementId = 'G-XNJBFNZKBD';
  const cookieName = 'np_analytics_opt_out';
  const maxAgeSeconds = 60 * 60 * 24 * 730;
  const readCookie = name => {
    try {
      const prefix = `${encodeURIComponent(name)}=`;
      return document.cookie.split(';').map(value => value.trim()).find(value => value.startsWith(prefix))?.slice(prefix.length) || '';
    } catch {
      return '';
    }
  };
  const cookieAttributes = maxAge => [
    `Path=/`,
    `Max-Age=${maxAge}`,
    'SameSite=Lax',
    ...(location.protocol === 'https:' ? ['Secure'] : [])
  ].join('; ');
  const writeCookie = (value, maxAge) => {
    try {
      document.cookie = `${encodeURIComponent(cookieName)}=${encodeURIComponent(value)}; ${cookieAttributes(maxAge)}`;
      return readCookie(cookieName) === value;
    } catch {
      return false;
    }
  };
  const clearCookie = () => {
    try {
      document.cookie = `${encodeURIComponent(cookieName)}=; ${cookieAttributes(0)}`;
      return readCookie(cookieName) !== 'off';
    } catch {
      return false;
    }
  };
  const currentUrl = new URL(location.href);
  const request = currentUrl.searchParams.get('analytics');
  let disabled = readCookie(cookieName) === 'off';
  let notice = null;

  if (request === 'off') {
    // Stop this first request even if persistent storage is unavailable.
    disabled = true;
    notice = writeCookie('off', maxAgeSeconds)
      ? {message: 'このブラウザはアクセス解析から除外されました', tone: 'success'}
      : {message: '除外設定を保存できませんでした。今回のページのみ解析を停止しています。', tone: 'error'};
  }
  if (request === 'on') {
    if (clearCookie()) {
      disabled = false;
      notice = {message: 'アクセス解析の除外設定を解除しました', tone: 'success'};
    } else {
      disabled = true;
      notice = {message: '除外設定を解除できませんでした。解析停止を継続しています。', tone: 'error'};
    }
  }

  // Google checks this flag before creating analytics cookies or sending data.
  window[`ga-disable-${measurementId}`] = disabled;
  window.NekoPartnerAnalyticsControl = Object.freeze({measurementId, disabled, cookieName});
  document.documentElement.dataset.analyticsOptOut = String(disabled);

  if (request === 'off' || request === 'on') {
    currentUrl.searchParams.delete('analytics');
    history.replaceState(history.state, '', `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
  }

  if (!notice) return;
  const showNotice = () => {
    const noticeElement = document.createElement('div');
    noticeElement.setAttribute('role', 'status');
    noticeElement.setAttribute('aria-live', 'polite');
    noticeElement.textContent = notice.message;
    Object.assign(noticeElement.style, {
      position: 'fixed', zIndex: '2147483647', right: '16px', bottom: '16px', maxWidth: 'calc(100vw - 32px)',
      padding: '11px 14px', borderRadius: '10px', fontSize: '14px', lineHeight: '1.5', color: '#342f2a',
      background: notice.tone === 'success' ? '#fffaf2' : '#fff1ee',
      border: `1px solid ${notice.tone === 'success' ? '#dccaa6' : '#d68e82'}`,
      boxShadow: '0 8px 24px rgba(54, 43, 33, .16)'
    });
    document.body.append(noticeElement);
    window.setTimeout(() => noticeElement.remove(), 4600);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showNotice, {once: true});
  else showNotice();
})();
