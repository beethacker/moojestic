console.log(document.location.href);

if (document.location.href.includes("localhost")) {
    //TODO maybe INSERT the refresh tag here?
    console.log("Enabling refresh!");
    var refreshToken = 0;
    function checkRefresh() {
        console.log("refresh?");
        fetch("http://localhost:9000/refresh.txt", {cache: "no-store"}).then(function(response) {
            return response.text();
        }).then(function(html) {
            var element = document.getElementById("refresh");
            if (element) {
                element.className = "";//unhide
                element.innerText = "Refresh:" + html;            
            }
            if (refreshToken != html && refreshToken != 0) {
                console.log("Reload!");
                document.location.reload(true);
            }
            refreshToken = html;
        }).catch(function(err) {
            console.warn("Can't fetch refresh token!", err);
        });

        window.setTimeout(checkRefresh, 5000);
    }
    checkRefresh();
}
