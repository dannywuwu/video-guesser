const API_HOST = "http://localhost:5000/"

export const getQuery = (search, setQueryResult, setSlice) => {
    if (search != "") {
        console.log(search)
        fetch(`http://localhost:5000/get/${search}`)
          .then((res) => res.json())
          .then((data) => {
            console.log("Fetch youtube", data);
            setQueryResult(data.items);
            setSlice((prev) => {
              return [0, 9];
            });
          })
          .catch((err) => console.log(err));
      }
}