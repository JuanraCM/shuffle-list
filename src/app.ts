import './style.css';
import Alpine from 'alpinejs';

window.Alpine = Alpine;

type List = {
  name: string;
  items: string[];
};

const lists: List[] = JSON.parse(localStorage.getItem('lists') || '[]');

const shuffle = (array: string[]): string[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

Alpine.data('app', () => ({
  lists,
  activeList: null as List | null,
  editMode: false as boolean,
  editList: { name: '', items: [''] } as List,
  shuffledItems: [] as string[],
  shuffledIndex: 0 as number,
  activeListName(): string {
    if (this.activeList) return this.activeList.name;

    return '';
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
  setActiveList(list: List): void {
    this.activeList = list;
  },
  unsetActiveList(): void {
    this.activeList = null;
    this.shuffledItems = [];
    this.shuffledIndex = 0;
  },
  setShuffledItems(): void {
    if (!this.activeList) return;

    this.shuffledItems = shuffle(this.activeList.items);
    this.shuffledIndex = 0;
  },
  setEditList(): void {
    this.editMode = true;
  },
  addItem(): void {
    this.editList.items.push('');
  },
  saveList(): void {
    if (!this.editList) return;

    this.lists.push(this.editList);
    localStorage.setItem('lists', JSON.stringify(lists));

    this.editMode = false;
    this.editList = { name: '', items: [''] };
  },
}));

Alpine.start();
