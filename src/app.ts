import './style.css';
import Alpine from 'alpinejs';

window.Alpine = Alpine;

type List = {
  name: string;
  items: string[];
};

const shuffle = (items: string[]): string[] => {
  const shuffledItems = [...items];

  for (let i = shuffledItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffledItems[i], shuffledItems[j]] = [shuffledItems[j], shuffledItems[i]];
  }

  return shuffledItems;
};

Alpine.store('lists', JSON.parse(localStorage.getItem('lists') || '[]'));
Alpine.store('activeList', false);
Alpine.store('newMode', false);
Alpine.store('newList', { name: '', items: [''] });

Alpine.data('index', () => ({
  isVisible(): boolean {
    return !this.$store.activeList && !this.$store.newMode;
  },
  emptyLists(): boolean {
    return (this.$store.lists as List[]).length == 0;
  },
  setActiveList(list: List): void {
    this.$store.activeList = list;
  },
  setNewListMode(): void {
    this.$store.newMode = true;
  },
  deleteList(index: number): void {
    (this.$store.lists as List[]).splice(index, 1);
    localStorage.setItem('lists', JSON.stringify(this.$store.lists));
  },
  listItemsInfo(list: List): string {
    const itemsLength = list.items.length;
    const pluralize = itemsLength > 1;

    return `${list.items.length} item${(pluralize && 's') || ''}`;
  },
}));

Alpine.data('form', () => ({
  isVisible(): boolean {
    return this.$store.newMode as boolean;
  },
  addItem(): void {
    (this.$store.newList as List).items.push('');
  },
  deleteItemAllowed(index: number): boolean {
    return index > 0;
  },
  deleteItem(index: number): void {
    (this.$store.newList as List).items.splice(index, 1);
  },
  saveList(): void {
    if (!this.$store.newList) return;

    (this.$store.lists as List[]).push(this.$store.newList as List);
    localStorage.setItem('lists', JSON.stringify(this.$store.lists));

    this.$store.newMode = false;
    this.$store.newList = { name: '', items: [''] };
  },
  exitNewMode(): void {
    this.$store.newMode = false;
    this.$store.newList = { name: '', items: [''] };
  },
}));

Alpine.data('active', () => ({
  shuffledItems: [] as string[],
  shuffledIndex: 0 as number,

  isVisible(): boolean {
    return !!this.$store.activeList;
  },
  currentShuffledItem(): string {
    return this.shuffledItems[this.shuffledIndex];
  },
  hasNextShuffledItem(): boolean {
    return !!this.shuffledItems[this.shuffledIndex + 1];
  },
  nextShuffledItem(): void {
    if (this.hasNextShuffledItem()) this.shuffledIndex++;
  },
  unsetActiveList(): void {
    this.$store.activeList = false;
    this.shuffledItems = [];
    this.shuffledIndex = 0;
  },
  setShuffledItems(): void {
    if (!this.$store.activeList) return;

    const items = (this.$store.activeList as List).items;

    this.shuffledItems = shuffle(items);
    this.shuffledIndex = 0;
  },
  itemsRemainingHint(): string {
    if (!this.$store.activeList) return '';

    return `Item ${this.shuffledIndex + 1} of ${this.shuffledItems.length}`;
  },
}));

Alpine.start();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.js')
    .then(() => {
      console.log('Service Worker Registered');
    })
    .catch((error) => {
      console.error('Service Worker Registration Failed:', error);
    });
}
