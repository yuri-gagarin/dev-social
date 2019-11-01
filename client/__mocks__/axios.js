import mockAxios from  "jest-mock-axios";

mockAxios.get("/api/posts")
  .then((response) => {
    console.log("mocked")
    return {
      status: 200,
    }
  })
export default mockAxios;