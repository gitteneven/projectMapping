const init = () => {
  console.log('Hello from main.ts');
  console.log('Hello xander here');
  console.log('Hello, Karo here');
}

init()
postMessage({ payload: 'removeLoading' }, '*')
