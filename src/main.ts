import './style.css';
import { initCreator } from './creator';
import { initAnimator } from './animator';

const params = new URLSearchParams(window.location.search);
const query = params.get('q');

if (query && query.trim()) {
  initAnimator(query.trim());
} else {
  initCreator();
}
