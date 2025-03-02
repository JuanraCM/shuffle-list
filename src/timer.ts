class Timer {
  public remaining: number = 0;

  private duration: number = 30;
  private intervalId: undefined | number = undefined;

  start(): void {
    this.stop();

    this.remaining = this.duration;
    this.intervalId = setInterval(() => {
      if (this.remaining > 0) {
        this.remaining--;
      } else {
        this.stop();
      }
    }, 1000);
  }

  stop(): void {
    clearInterval(this.intervalId);

    this.intervalId = undefined;
    this.remaining = 0;
  }
}

export default Timer;
