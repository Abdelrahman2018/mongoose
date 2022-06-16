var input = [1,2,3,4,5,6,7,8,9,10];

const chuncks = (array, chunckSize) => {
  let arrayLength = array.length
  const finalArray = []
  const reminder = arrayLength % chunckSize
  let tmpArray = []

  if(reminder === 0){
    for (let i = 0; i < arrayLength; i++) {
      tmpArray.push(array[i])
      if(tmpArray.length == chunckSize){
        finalArray.push(tmpArray)
        tmpArray = []
      }
    }
  }else{
    arrayLength-= reminder
    let j = 0
    for (j; j < arrayLength; j++) {
      tmpArray.push(array[j])
      if(tmpArray.length == chunckSize){
        finalArray.push(tmpArray)
        tmpArray = []
      }
    }
    finalArray.push(array.slice(j, arrayLength+reminder))
  }
  return finalArray
}

describe("test chuncks", () => {
  it("should return 5 equal size chuncks if array size = 10 & n=2", () => {
    expect(chuncks(input, 2)).toEqual([
      [1,2], [3,4], [5,6], [7,8], [9,10]
    ])
  })

  it("should return 4 chuncks first 3 is four length and 1 is one length  if array size = 10 & n=3", () => {
    expect(chuncks(input, 3)).toEqual([
      [1,2,3], [4,5,6], [7,8,9], [10]
    ])
  })

  it("should return 2 chuncks first one is seven length and second one is three length  if array size = 10 & n=7", () => {
    expect(chuncks(input, 7)).toEqual([
      [1,2,3,4,5,6,7], [8,9,10]
    ])
  })
})