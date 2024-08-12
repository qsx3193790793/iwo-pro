//定时任务
export default {

  install(Vue, options) {

    Vue.prototype.$$timingTask = {
      count: 0,
      timerHandler: null,
      taskQueue: [],//任务队列
      clear() {
        clearTimeout(this.timerHandler);
        this.taskQueue.splice(0, this.taskQueue.length);
        return this;
      },
      getTaskGenerator: function* () {//获取任务迭代器
        yield* this.taskQueue;
      },
      addTask(task) {
        // task = {taskName:任务名,invoke：执行方法}
        if (!task.taskName || !task.invoke) throw new Error('addTask error (taskName||invoke) can not null!');
        !this.taskQueue.filter(o => o.taskName === task.taskName).length && this.taskQueue.push(task);//先判断队列中是否有相同任务 没有则加入队列
        console.log(this.taskQueue)
        return this;
      },
      removeTask(taskName) {
        const index = this.taskQueue.findIndex(task => task.taskName === taskName);
        index >= 0 && this.taskQueue.splice(index, 1);
        return this;
      },
      start(delay) {
        clearTimeout(this.timerHandler);
        this.count === 0 && console.log('定时任务开始...');
        console.log('定时任务轮询次数：', this.count, 'delay:', delay, this.taskQueue);
        this.timerHandler = setTimeout(async () => {
          let taskGenerator = this.getTaskGenerator(), task = null;
          while (!(task = taskGenerator.next()).done) {
            let taskObject = task.value;
            console.log('正在执行----->', taskObject.taskName);
            taskObject.invoke && await taskObject.invoke(true);
          }
          this.count++;
          this.start(delay);
        }, delay || 20000);
      }
    };
  }
};
