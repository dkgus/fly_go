
window.addEventListener("DOMContentLoaded", function() { 

    let bg=document.getElementById('bg');
    let moon=document.getElementById('moon');
    let mountain=document.getElementById('mountain');
    let road=document.getElementById('road');
    let text=document.getElementById('text');
    
    
    window.addEventListener("scroll",function(){
        let value =window.scrollY;
    
        bg.style.top= value * 0.5  + 'px';
        moon.style.left= -value * 0.5  + 'px';
        mountain.style.top= -value * 0.15  + 'px';
        road.style.top= value * 0.15  + 'px';
        text.style.top= value * 1  + 'px';
    
    
        
    
    });
    
    
    
    let slides = document.querySelector(".slides");
    let slide= document.querySelectorAll(".slides li");
    let currentIdx =0;
    let slideCount =slide.length;
    let prevBtn=document.querySelector('.prev');
    let slideWidth=300;
    let slideMargin=30;
    let nextBtn=document.querySelector('.next');
    
    slides.style.width=(slideWidth + slideMargin)*slideCount - slideMargin +'px';
    
    
    function moveslide(num){
        slides.style.left = -num * 330 + "px";
        currentIdx=num;
    }
    
    nextBtn.addEventListener("click",function(){
        if(currentIdx <slideCount -3 ){
            moveslide(currentIdx + 1)
    
        }else{
            moveslide(0);
        }
    });
    
    prevBtn.addEventListener("click",function(){
        if(currentIdx >0 ){
            moveslide(currentIdx -1)
    
        }else{
            moveslide(slideCount -3);
        }
    });
    
    
    
    // 메인바
    
    const toggleBtn =document.querySelector(".navbar__toogleBtn");
    const menu =document.querySelector(".navbar__menu");
    const icons =document.querySelector(".navbar__icons");
    
    toggleBtn.addEventListener('click',()=>{
        menu.classList.toggle('active');
        icons.classList.toggle('active');
    });
    
    
    
    
    
    
    // 상단메인바 고정
    // function naviFixer(){
    //     const top = $("#pos_scroll").offset().top;
    //     const scrollTop =  $(window).scrollTop();
    
    //     top.removeClass("fixed");
        
    // 	if (top < scrollTop) { 
    // 		top.addClass("fixed");
    //     }
    // }
    
    
    
    // $(() => {
        
    // 	$(window).scroll(function() {
    // 		naviFixer();
    // 	});
    // });
    
    
    
    
    });
    