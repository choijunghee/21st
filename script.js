document.addEventListener('DOMContentLoaded', function() {
    const bookElement = document.getElementById('book');
    const flipSound = document.getElementById('flipSound');
    const pageIdxDisplay = document.getElementById('pageIdx');

    // 1. 페이지 생성 (67페이지까지만 생성)
    for (let i = 1; i <= 67; i++) {
        const page = document.createElement('div');
        page.className = 'page';
        
        // 마지막 페이지(67p)일 경우 '처음으로' 버튼 추가
        if (i === 67) {
            page.innerHTML = `
                <div class="page-content">
                    <img src="images/${i}.jpg" alt="페이지 ${i}">
                    <div class="last-page-overlay">
                        <button onclick="goToFirstPage()" class="retry-btn">처음부터 다시보기</button>
                    </div>
                    <div class="page-num">${i}</div>
                </div>
            `;
        } else {
            page.innerHTML = `
                <div class="page-content">
                    <img src="images/${i}.jpg" alt="페이지 ${i}">
                    <div class="page-num">${i}</div>
                </div>
            `;
        }
        bookElement.appendChild(page);
    }

    // 2. PageFlip 초기화
    const pageFlip = new St.PageFlip(bookElement, {
        width: 400,
        height: 600,
        size: "stretch",
        showCover: true,
        mobileScrollSupport: true
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    // 전역 함수로 선언하여 버튼에서 호출 가능하게 함
    window.goToFirstPage = function() {
        pageFlip.flip(0); // 0번 인덱스(첫 페이지)로 이동
    };

    // 3. 이벤트: 페이지 번호 업데이트 및 소리
    pageFlip.on('flip', (e) => {
        flipSound.currentTime = 0;
        flipSound.play();
        pageIdxDisplay.innerText = `${e.data + 1} / 67`;
    });

    // 4. 하단 버튼 로직
    document.getElementById('prevBtn').addEventListener('click', () => {
        pageFlip.flipPrev();
    });
    document.getElementById('nextBtn').addEventListener('click', () => {
        // 마지막 페이지에서 '다음' 누르면 첫 페이지로 이동하는 루프 기능
        if (pageFlip.getCurrentPageIndex() === 66) { // 인덱스는 0부터 시작하므로 66이 67페이지
            pageFlip.flip(0);
        } else {
            pageFlip.flipNext();
        }
    });

    // 5. 반응형 설정
    function updateOrientation() {
        if (window.innerWidth <= 768) {
            pageFlip.update({mode: 'portrait'});
        } else {
            pageFlip.update({mode: 'landscape'});
        }
    }
    window.addEventListener('resize', updateOrientation);
    updateOrientation();
});