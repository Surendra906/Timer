const hoursInput=document.getElementById('hours');
const minutesInput=document.getElementById('minutes');
const secondsInput=document.getElementById('seconds');
const startBtn=document.getElementById('start-btn');
const timersContainer=document.getElementById('timers-container');
const noTimersMsg=document.getElementById('no-timers-msg');
const alarmSound=document.getElementById('alarm-sound');

let timers=[];

startBtn.addEventListener('click',()=>{
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    const totalseconds=(hours*3600)+(minutes*60)+seconds;

    if(totalseconds<=0){
        alert('Please enter a valid time greater than 0.');
        return;
    }
    createTimer(totalseconds);
   
    hoursInput.value = 0;
    minutesInput.value = 0;
    secondsInput.value = 0;
});

function createTimer(durationInSeconds){
    noTimersMsg.style.display='none';
    const timerObj={
        id:Date.now(),
        remainingTime:durationInSeconds,
        intervalId:null
    };
    const timerCard=document.createElement('div');
    timerCard.className='timer-card';
    timerCard.setAttribute('data-id',timerObj.id);

    timerCard.innerHTML=`
    <span class="timer-time">${formatTime(timerObj.remainingTime)}</span>
    <button class="stop-btn" data-id="${timerObj.id}">Stop Timer</button>
    `;
    timersContainer.appendChild(timerCard);
    timerObj.intervalId=setInterval(()=>{
        timerObj.remainingTime--;
        const timeDisplay=timerCard.querySelector('.timer-time');
        timeDisplay.textContent=formatTime(timerObj.remainingTime);
        if(timerObj.remainingTime<=0){
            clearInterval(timerObj.intervalId);
            handleTimerEnd(timerCard,timerObj);
        }
    },1000);
    const stopBtn=timerCard.querySelector('.stop-btn');
    stopBtn.addEventListener('click',()=>{
        clearInterval(timerObj.intervalId);
        removeTimer(timerObj.id,timerCard);
    });
    timers.push(timerObj);
}

function formatTime(totalSeconds){
    const hrs=Math.floor(totalSeconds/3600);
    const mins=Math.floor((totalSeconds%3600)/60);
    const secs=totalSeconds%60;

    return `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
}
function handleTimerEnd(timerCard,timerObj){
    timerCard.classList.add('ended');
    const timerDisplay=timerCard.querySelector('.timer-time');
    timerDisplay.textContent="Time's Up!";

    alarmSound.currentTime=0;
    alarmSound.play().catch(error=>console.log("Audio playback prevented:", error));
    
    const stopBtn=timerCard.querySelector('.stop-btn');
    stopBtn.textContent='Dismiss';
}
function removeTimer(id,timerCard){
    timers=timers.filter(t=>t.id !==id);
    timerCard.remove();
    if(timers.length===0){
        noTimersMsg.style.display='block';
    }
}