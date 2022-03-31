import { screen } from '@testing-library/react';
import React from 'react';
import { NotFound } from '../components';
import renderWithRouter from './helpers/renderWithRouter';

describe(
  'Teste o componente <FavoritePokemons.js />',
  () => {
    it('Teste se página contém um heading com o texto Page requested not found', () => {
      renderWithRouter(<NotFound />);

      const errorMessage = screen.getByRole('heading', { name: /not found/i, level: 2 });
      expect(errorMessage).toBeDefined();
    });

    it('Teste se página mostra a imagem https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif', () => {
      renderWithRouter(<NotFound />);

      const pikachuImage = screen.getByAltText(/Pikachu crying/i);
      expect(pikachuImage).toBeDefined();
      expect(pikachuImage).toHaveAttribute('src', 'https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif');
    });
  },
);
