const isEven = (number) => {
  if(number % 2 == 0)
    return true
  return false
}


describe("isEven function", () => {
  it("should be return true when number is even", ()=> {
    expect(isEven(2)).toBeTrue()
  })

  it("should be return false when number is oddd", ()=> {
    expect(isEven(1)).toBeFalse()
  })
})