
let timerlist = {};

const newID = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
};

export const addTask = (timerId, task) => {
    const taskId = newID();
    const timer = timerlist[timerId];
    const tasks = {...timer.tasks, [taskId]: task};
    timerlist = {...timerlist, [timerId]: {externalId: timer.externalId, tasks: tasks}};
    return taskId;
};

const createProcessor = (timerId) => {
    return () => {
        let timer = timerlist[timerId];
        for (let key in timer.tasks) {
            timer.tasks[key]();
        }
    };
};

export const startTimer = (millis) => {
    const timerId = newID();
    const processor = createProcessor(timerId);
    const extTimerId = setInterval(processor, millis);
    timerlist = {...timerlist, [timerId]: {externalId: extTimerId, tasks: {}}};
    return timerId;
};

export const stopTimer = (timerId) => {
    let timer = timerlist[timerId];
    clearInterval(timer.externalId);
};