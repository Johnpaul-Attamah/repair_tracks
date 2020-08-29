const generateRcode = () =>
   Math.random().toString(36).substring(2, 3) + Math.random().toString(26).substring(3, 4) + Math.random().toString(32).substring(5, 6) + Math.random().toString(27).substring(2, 3) + Math.random().toString(33).substring(3, 4) + Math.random().toString(31).substring(6, 7) + Math.random().toString(28).substring(4, 5) + Math.random().toString(36).substring(8, 9);


export default generateRcode;