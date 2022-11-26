/**
* @description Shift an array {degree} times in place. ex:
*
* shift([1,2,3], 1) => [2,3,1]
*/
export const shift = (array: any[], degree: number) => {
  for (let i = 0; i < degree; i++) {
    array.push(array.shift())
  }
}

/**
* @description Just the first letter
*/
export const capitalize = (str: string) => {
  return (str.split('').shift() as string).toUpperCase() + str.slice(1, str.length)
}

