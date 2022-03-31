import { screen } from '@testing-library/react';
import React from 'react';
import FavoritePokemons from '../components/FavoritePokemons';
import pokemons from '../data';
import renderWithRouter from './helpers/renderWithRouter';

describe(
  'Teste o componente <FavoritePokemons.js />',
  () => {
    it(`Teste se é exibido na tela a mensagem No favorite pokemon found,
    se a pessoa não tiver pokémons favoritos`, () => {
      renderWithRouter(<FavoritePokemons />);

      const pokemonNotFound = screen.getByText(/No favorite pokemon found/i);
      expect(pokemonNotFound).toBeDefined();
    });

    it('Teste se é exibido todos os cards de pokémons favoritados', () => {
      const charmander = pokemons.find((pokemon) => pokemon.name === 'Charmander');
      const alakazam = pokemons.find((pokemon) => pokemon.name === 'Alakazam');
      const mew = pokemons.find((pokemon) => pokemon.name === 'Mew');
      const pokemonsArray = [charmander, alakazam, mew];
      renderWithRouter(<FavoritePokemons pokemons={ pokemonsArray } />);

      const favorites = screen.getAllByTestId(/pokemon-name/i);
      const numberOfPokemons = 3;

      expect(favorites).toHaveLength(numberOfPokemons);
      expect(favorites[0]).toHaveTextContent(/charmander/i);
      expect(favorites[1]).toHaveTextContent(/alakazam/i);
      expect(favorites[2]).toHaveTextContent(/mew/i);
    });
  },
);
