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
Alpine.store('editMode', false);
Alpine.store('editList', { name: '', items: [''] });

Alpine.data('index', () => ({
  isVisible(): boolean {
    return !this.$store.activeList && !this.$store.editMode;
  },
  setActiveList(list: List): void {
    this.$store.activeList = list;
  },
  setEditList(): void {
    this.$store.editMode = true;
  },
}));

Alpine.data('form', () => ({
  isVisible(): boolean {
    return this.$store.editMode as boolean;
  },
  addItem(): void {
    (this.$store.editList as List).items.push('');
  },
  deleteItem(index: number): void {
    (this.$store.editList as List).items.splice(index, 1);
  },
  saveList(): void {
    if (!this.$store.editList) return;

    (this.$store.lists as List[]).push(this.$store.editList as List);
    localStorage.setItem('lists', JSON.stringify(this.$store.lists));

    this.$store.editMode = false;
    this.$store.editList = { name: '', items: [''] };
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
