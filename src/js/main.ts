const init = () => {
  console.log('Hello from main.ts');
  console.log('Hello xander here');
}

init()
postMessage({ payload: 'removeLoading' }, '*')
