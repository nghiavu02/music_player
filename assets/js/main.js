
/*
 * 1.Render song v
 * 2.Scroll top  v
 * 3.Play / pause / seek v
 * 4 CD rotate v
 * 5.Next / prev v
 * 6.Random v
 * 7.Next / repeat when ended v
 * 8 active song  v
 * 9. Scroll active song into view v
 * 10. Play song when click
 */
//Phương thức mới .animate .click .defineProperty scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
// .closest .setItem .getItem
//Khai báo biến
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = "MUSIC_PLAYER"

const heading = $("header h2")
const cdThumb = $(".cd-thumb")
const audio = $("#audio")
const cd = $(".cd")
const player = $(".player")
const playBtn = $(".btn-toggle-play")
const progress = $("#progress")
const nextBtn = $(".btn-next")
const prevBtn = $(".btn-prev")
const randomBtn = $(".btn-random")
const replayBtn = $(".btn-repeat")
const rangeVolume = $(".range-volume")
const playlist = $(".playlist")
const app = {
    currentIndex : 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    //config: {}
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs : [
        {
            name: 'Gấp đôi yêu thương',
            singer: 'Tuấn Hưng',
            path: './assets/music/song1.mp3',
            image: './assets/image/song1.jpg'
        },
        {
            name: 'Đáy biển',
            singer: 'Ba Khúc gỗ',
            path: './assets/music/song2.mp3',
            image: './assets/image/song2.jpg'
        },
        {
            name: 'Luyến nhân tâm',
            singer: 'Hoa thiên cốt',
            path: './assets/music/song3.mp3',
            image: './assets/image/song3.jpg'
        },
        {
            name: 'Xuân hạ thu đông',
            singer: 'Phương Thanh',
            path: './assets/music/song4.mp3',
            image: './assets/image/song4.jpg'
        },
        {
            name: 'Easy my mind',
            singer: 'Easy',
            path: './assets/music/song5.mp3',
            image: './assets/image/song5.jpg'
        },
        {
            name: 'Đáp án của bạn',
            singer: 'Lưu Khúc',
            path: './assets/music/song6.mp3',
            image: './assets/image/song6.jpg'
        },
        {
            name: 'Nổi gió rồi',
            singer: 'Châu Thâm',
            path: './assets/music/song7.mp3',
            image: './assets/image/song7.jpg'
        },
        {
            name: 'Nhất lộ sinh hoa',
            singer: 'Ôn Dịch Tâm',
            path: './assets/music/song8.mp3',
            image: './assets/image/song8.jpg'
        },
        {
            name: 'Phù quan',
            singer: 'Phù quan',
            path: './assets/music/song9.mp3',
            image: './assets/image/song9.jpg'
        },
        {
            name: 'Một đường nở hoa',
            singer: 'No Singer',
            path: './assets/music/song10.mp3',
            image: './assets/image/song10.jpg'
        },
        {
            name: 'Just a dream',
            singer: 'No singer',
            path: './assets/music/song11.mp3',
            image: './assets/image/song11.jpg'
        },
    ],
    setConfig: function(key, value){
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    }
    ,
    //Hàm định nghĩa
    defineProperties: function(){
        //định nghĩa cho thuộc tính object
        Object.defineProperty(this, "currentSong",  {
            get:function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    //render ra màn hình
    render: function(){
        const htmls = this.songs.map((song, index)=>{
            return `
                    <div data-index="${index}" class="song ${index === this.currentIndex ? 'active' : ''}">
                        <div class="thumb"
                            style="background-image: url('${song.image}')">
                        </div>
                         <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                         </div>
                        <div class="option">
                            <i class="fa-solid fa-ellipsis"></i>
                        </div>
                     </div>
            `
        })
        playlist.innerHTML = htmls.join("")
    },
    //lắng nghe các sự kiện
    handleEvent: function(){
        const _this = this
        const cdWidth = cd.offsetWidth
        //Xử lý CD quay
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)',
            }
        ],{
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        //lắng nghe sự kiện scroll
        document.onscroll = function(){
            //khi scroll xuống bao nhiêu thì cd thu nhỏ bấy nhiêu
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newScroll = cdWidth - scrollTop
            cd.style.width = newScroll > 0 ? newScroll + "px" : 0
            cd.style.opacity = newScroll / scrollTop
        }
        //Xu lý play click
        playBtn.addEventListener("click", function(){
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        })

        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
            _this.render()
        };
        // Khi song bị pause
        // When the song is pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };
        
        //Xử lý time line
        audio.addEventListener("timeupdate", function(){
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = progressPercent
        })

        //Xử lý tua 
        progress.addEventListener("change", function(e){
            const seek = audio.duration / 100 * e.target.value
            audio.currentTime = seek
        })
        //Xử lý even click next song
        nextBtn.addEventListener("click", function(){
           if(_this.isRandom){
            _this.playSongRandom()
           }
           else{
               _this.nextSong()
           }
           audio.play()
           _this.scrollToActiveSong()
           
        })
         //Xử lý even click prev song
         prevBtn.addEventListener("click", function(){
            if(_this.isRandom){
                _this.playSongRandom()
            }
            else{
                _this.prevSong()
            }
         
            audio.play()
            _this.scrollToActiveSong()
            
        })
        //Random song
        randomBtn.addEventListener("click", function(){
            _this.isRandom = !_this.isRandom
            //api của toggle(value 1, value 2) 
            //value1 là class muốn thêm hoặc xóa, value 2 là boolean
            // nếu là true thì add class , false remove
            _this.setConfig("isRandom", _this.isRandom)
            randomBtn.classList.toggle("active", _this.isRandom)
        })
       //Xử lý sk khi ended
       audio.addEventListener("ended", function(){
            if(_this.isRepeat){
                audio.play()
            }else
            nextBtn.click()
       })
       //Xử lý lặp lại 1 bài song
       replayBtn.addEventListener("click", function(){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig("isRepeat", _this.isRepeat)

            replayBtn.classList.toggle("active", _this.isRepeat)
           
        })
        //Xử lý khi tăng giảm âm lượng
        rangeVolume.addEventListener("input", function(e){
            const currentValume = e.target.value / 100
            audio.volume = currentValume
            // console.log( audio.volume = parseFloat((audio.volume + 0.1).toFixed(1)))
        })
        //Lắng nghe sự kiện click vào playlist
        playlist.addEventListener("click", function(e){
            const songNode = e.target.closest('.song:not(.active')
            // Kiểm tra bài hát nào đang không active và ngoại trừ nút option mới xử lí
            if(songNode || e.target.closest('.option')){
               if(e.target.closest('.option')){
                    alert("chức năng chưa được xây dựng")
               }
               if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
               }
            }
        })
    },
    //Hàm load ra UI
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src= this.currentSong.path
        
     
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

    },
    //next song
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    //prev song
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    //Play random song
    playSongRandom: function(){
        let newIndex 
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while(this.currentIndex == newIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    //Xử lý hiển thị song lên view UI
    scrollToActiveSong: function(){
        setTimeout(() =>{
            $(".song.active").scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
        }, 300)
    },
    //Repeat
    //Hàm chạy chương trình
    start: function(){
        this.loadConfig()
        //Hàm định nghĩa
        this.defineProperties()
        //hàm load ra màn hình
        this.loadCurrentSong()
        //Hàm lắng nghe sự kiện
        this.handleEvent()

        //render ra website
        this.render()
        //
        randomBtn.classList.toggle("active", this.isRandom)
        replayBtn.classList.toggle("active", this.isRepeat)
    }
}
app.start()