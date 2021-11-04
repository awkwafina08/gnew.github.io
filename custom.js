$(document).ready(function(){
    /**
     * Khi click vào "SEARCH" hiển thị hộp tìm kiếm
     */
    $("#search-menu").click(function(){
        $("#light-box").removeClass("hide");
        $(".header, .main, .footer").animate({"opacity" : ".50"}, 300, "linear");
        $(".light-box").animate({"opacity" : "1.0"}, 300, "linear");
    });
    /**
     * Khi click vào "Close" đóng hộp tìm kiếm
     */
    $(".close-btn").click(function(){
        $(".header, .main, .footer").animate({"opacity" : "1.0"}, 300, "linear");
        $("#light-box").addClass("hide");
        $(".lds-dual-ring").hide();
        $("#search-key").css("border-color", "gray");
        $("#keyword-mess").text("");

    });
    //token của api
    var token = "39caea6775d8adb5c710ac878d219485";
    var req ="https://gnews.io/api/v4/top-headlines?&token="+token+"&lang=en";
    /**tạo request để lấy dữ liệu
     * dữ liệu được trả về thì truyền vào hàm inputNew để chuyển thành html 
     */
    $(".footer").hide(); 
    fetch(req)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var news = "LASTEST NEWS";
        
        inputNew(data,news);
    });
    /**
     * 1  Khi click vào "SEARCH" hộp tìm kiếm hiện ra
     * 2. Nhập từ khóa muốn tìm kiếm
     * 3. Chọn khoảng từ gian tìm kiếm từ startDate -> endDate
     * 4. Khi click vào "Search" thì tạo 1 request theo những dữ liệu yêu cầu
     * 5. Dữ liệu trả về được chuyển thành HTML qua hàm inputNew
     */
    $(".search-btn").click(function(){
        //show hiệu ứng loading
        $(".lds-dual-ring").show();
        var keyword = $("#search-key").val();
        $("#search-key").val("");
        var today = new Date();
        var date1 = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate()-1);
        var date2 = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        //nếu người dùng không chọn ngày thì sẽ tìm theo từ ngày hôm trước đến ngày hiện tại
        var startDate =  new Date($("#start-date").val()||date1).toISOString().split('.')[0] + "Z";
        var endDate =  new Date($("#end-date").val()||date2).toISOString().split('.')[0] + "Z";
        $("#start-date").val("");
        $("#end-date").val("");
        console.log("test " + startDate);
        //nếu người dùng không nhập từ khóa tìm kiếm thì báo lỗi
        if(keyword!=""){
            $(".header, .main, .footer").animate({"opacity" : "1.0"}, 300, "linear");
            $("#light-box").addClass("hide");
            $("#search-key").css("border-color", "black");
            $("#keyword-mess").text("");
            request = "https://gnews.io/api/v4/search?q="+keyword+"&from="+startDate+"&to="+endDate+"&token="+token+"&lang=en";
            fetch(request)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var news = "RESULT";
                inputNew(data,news);
            });
        }else{
            $("#search-key").css("border-color", "orange");
            $("#keyword-mess").text("Please enter keyword");
        }

    });
    $("#home, #logo").click(function(){
        $(".lds-dual-ring").show();
        fetch(req)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var news = "LASTEST NEWS";
           inputNew(data,news);
        });
    });
});
/**
 * 
 * @param {object} data
 * lấy dữ liệu từ json được trả về 
 * chuyển từ json thành html
 */
function inputNew(data,news){
    let html="";
    var getData = data.articles;
    for(i = 0; i < getData.length; i++){
        date = new Date(getData[i].publishedAt);
        if(i == 0){
            html+= "<div class ='topheading-box'><div class='news-header'><h1>"+news+"</h1></div><div class='img-box'><img src='"+getData[i].image
                +"'></div><div><h3><a href="+getData[i].url+">"+getData[i].title
                +"</a></h3><p><em>Post by "+getData[i].source.name+" at "+date+"</em></p><p class='p'>"+getData[i].description
                +"<a href="+getData[i].url+"> read more</a></div></div><hr>";
        }else{
        html+= "<div class ='content-box'><div class='img-box'><img src='"+getData[i].image
                +"'></div><div class='main-content'><h3><a href="+getData[i].url+">"+getData[i].title
                +"</a></h3><p><em>Post by "+getData[i].source.name+" at "+date+"</em></p><p class='p'>"+getData[i].description
                +"<a href="+getData[i].url+"> read more</a></div></div><hr>";}
    }    
    $(".main").html(html);
    //sau khi chuyển từ json thành html thì ẩn hiểu ứng loading đi để hiển thị trang web
    $(".lds-dual-ring").hide();
    $(".footer").show(); 
    
}