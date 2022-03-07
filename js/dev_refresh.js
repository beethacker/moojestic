console.log(document.location.href);

if (document.location.href.includes("localhost")) {
    console.log("Enabling refresh!");
    var refreshToken = 0;
    function checkRefresh() {
        fetch("http://localhost:9000/refresh.txt").then(function(response) {
            return response.text();
        }).then(function(html) {
            var element = document.getElementById("refresh");
            if (element) {
                element.innerText = "Refresh:" + html;            
            }
            if (refreshToken != html && refreshToken != 0) {
                document.location.reload(true);
            }
            refreshToken = html;
        }).catch(function(err) {
            console.warn("Can't fetch refresh token!", err);
        });

        window.setTimeout(checkRefresh, 1000);
    }
    checkRefresh();
}
