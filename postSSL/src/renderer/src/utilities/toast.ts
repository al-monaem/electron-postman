export const showToast = (status: number, message: string) => {
  if (window['toast']) {
    window['toast'].show({
      severity:
        status >= 200 && status < 300
          ? 'success'
          : status >= 400 && status < 500
            ? 'warn'
            : 'error',
      summary: message
      //   detail: 'hello'
    })
  }
}
