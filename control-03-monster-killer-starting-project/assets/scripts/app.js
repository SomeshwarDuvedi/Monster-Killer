const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE =14;
const HEAL_VALUE = 20;

const MODE_ATTACK ='ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';


let battleLog = [];
let lastLoggedEntry;

function getMaxLifeValue(){
    const enteredValue = prompt('Maximum life for you and the monster.','100');
    let parseValue = parseInt(enteredValue);
    if(isNaN(parseValue) || parseValue <=0){
        throw{
            message:'Invalid user input, not a number'
        };
    }
    return parseValue;
}

let chosenMaxLife;
try{
 chosenMaxLife = getMaxLifeValue();
}catch(err){
    console.log(err);
    chosenMaxLife =100;
    alert('You enetred something wrong, default value of 100 is used.');
} 
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true; 

adjustHealthBars(chosenMaxLife);

function writeToLog(ev,val,monsterHealth,playerHealth){
    let logEntry ={
        event: ev,
        value: val,
        target:'',
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    };
    switch (ev) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target='MONSTER';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target='MONSTER';
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry.target='PLAYER';
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target='MONSTER';
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry ={
                event: ev,
                value: val,
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
    
        default:
            logEntry ={};
            break;
    }
    // if (ev === LOG_EVENT_PLAYER_ATTACK){
    //     logEntry.target='MONSTER';
    // } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK){
    //     logEntry.target='MONSTER';
    // } else if (ev === LOG_EVENT_MONSTER_ATTACK){
    //     logEntry.target='PLAYER';
    // } else if (ev === LOG_EVENT_PLAYER_HEAL){
    //     logEntry.target='MONSTER';
    // } else if (ev === LOG_EVENT_GAME_OVER){
    //     logEntry ={
    //         event: ev,
    //         value: val,
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
    // }
    battleLog.push(logEntry);
}
function reset(){
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound(){
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK,playerDamage,currentMonsterHealth,currentPlayerHealth);

    if(currentPlayerHealth<=0 && hasBonusLife ){
        hasBonusLife =false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('You would be dead but bonus life saves you!');
    }
    if (currentMonsterHealth <=0 && currentPlayerHealth >0){
        alert('You Won!');
        writeToLog(LOG_EVENT_GAME_OVER,'PLAYER WON',currentMonsterHealth,currentPlayerHealth);
    }
    else if (currentPlayerHealth <=0 && currentMonsterHealth>0){
        alert('You Lose!');
        writeToLog(LOG_EVENT_GAME_OVER,'MONSTER WON',currentMonsterHealth,currentPlayerHealth);
    }
    else if (currentMonsterHealth <=0 && currentPlayerHealth<=0){
        alert('You have a Draw!');
        writeToLog(LOG_EVENT_GAME_OVER,'A DRAW',currentMonsterHealth,currentPlayerHealth);
    }
    if(currentMonsterHealth <=0 || currentPlayerHealth<=0){
        reset();
    }

}
function attackMonster(mode){
    let maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE:STRONG_ATTACK_VALUE;
    let logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK:LOG_EVENT_PLAYER_STRONG_ATTACK;
    // if(mode === MODE_ATTACK){
    //     maxDamage = ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_ATTACK;
    // }else if(mode === MODE_STRONG_ATTACK){
    //     maxDamage = STRONG_ATTACK_VALUE;
    //     logEvent =LOG_EVENT_PLAYER_STRONG_ATTACK
    // }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(logEvent,damage,currentMonsterHealth,currentPlayerHealth);
    endRound();
    
}
function attackHandler(){
    attackMonster(MODE_ATTACK);
}
function strongAttackHandler(){
    attackMonster(MODE_STRONG_ATTACK);
}
function healPlayerHandler(){
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife -HEAL_VALUE){
        alert("You can't heal to more than your max initial heath.");
    }else{
        healValue = HEAL_VALUE;
    }
   increasePlayerHealth(healValue);
   currentPlayerHealth += healValue;
   writeToLog(LOG_EVENT_PLAYER_HEAL,healValue,currentMonsterHealth,currentPlayerHealth);
   endRound();
}
function printLogHandler(){
    let i=0;
    // for(let i=0;i<battleLog.length;i++){
    //     console.log(battleLog[i]);
    // }
    // for(let i=10;i>0;){
    //     i--;
    //     console.log(i);
    // }
    // console.log(battleLog);
    outerWhile: while(i <3){
        console.log('Outer',i);
        innerFor: for(let j=0;j<4;j++){
            if(j===3){
                break outerWhile;
            }
            console.log('Inner',j);
        }
        i++;
    }
    // do{
    //     console.log(i);
    //     i++;
    // }while(i<0);
    
    for(const logEntry of battleLog){
        if ((!lastLoggedEntry && lastLoggedEntry !==0) || lastLoggedEntry < i){
            console.log(`#${i}`);
            for(const key in logEntry){
                console.log(`${key} => ${logEntry[key]}`);
            }
            lastLoggedEntry = i;
            break;

        }      
        i++;
        
    }
}

attackBtn.addEventListener('click',attackHandler);
strongAttackBtn.addEventListener('click',strongAttackHandler);
healBtn.addEventListener('click',healPlayerHandler);
logBtn.addEventListener('click',printLogHandler);
