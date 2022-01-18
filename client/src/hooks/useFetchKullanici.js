export const useFetchKullanici = () => {
  const fetchKullanici = async (kullanici_id) => {
    if (kullanici_id) {
      try {
        const res = await fetch(
          `http://localhost:5000/kullanici/${kullanici_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return res.json();
      } catch (err) {
        console.log(err.message);
      }
    } else {
      console.log("yok");
      return;
    }
  };
  return fetchKullanici;
};
