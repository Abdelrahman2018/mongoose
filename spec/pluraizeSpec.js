const pluraize = function(string, count) {
  if(count > 1)
    return string + 's'

  return string
}


describe("plurization function", function(){
  it("should return dogs when count = 2", function(){
    expect(pluraize('dog', 2)).toBe("dogs")
  })

  it("should be dog when count == 1", () => {
    expect(pluraize("dog", 1)).toBe("dogs")
  })
})