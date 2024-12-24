// Function to fetch data from the API
async function fetchData(userEmail) {
  console.log(userEmail)
  const apiUrl = "https://script.googleusercontent.com/macros/echo?user_content_key=AiT1p2nQ0ZV9rUBLI52HHHG5XJ7kVEJlP1d-lTbyAqqSXlGY08wCPqVKL-BtDNjorxGwdJMSo9cdg1ZukQOy2LGcz1eqxd_km5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnKsYlWJMwu0w5zbXRJ-rxYqNQuLYzF_Is_LNu88l3d5PV_9QDiPLTNuCV3SvLnlCh-yhADb7bFOnGoNDd_1e4w-AjxSldXHqdg&lib=M-rHMzv28XkGpAlJt7kY9N7BL8y2cZgtr";

  try {
    const response = await fetch(apiUrl);

    if (response.ok) {
      const data = await response.json();

      // Find the user by email
      const user = data.find(item => item.user === userEmail);

      if (user) {
        const { jobsAppliedDaily, jobsAppliedMonthly } = user;

        console.log(`User: ${userEmail}`);
        console.log(`Jobs Applied Daily: ${jobsAppliedDaily}`);
        console.log(`Jobs Applied Monthly: ${jobsAppliedMonthly}`);

        return { jobsAppliedDaily, jobsAppliedMonthly };
      } else {
        console.error("User not found.");
      }
    } else {
      console.error("Error fetching data: ", response.status);
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

// Example call
// fetchData("harshrjto@kgpian.iitkgp.ac.in");

module.exports = {fetchData}
