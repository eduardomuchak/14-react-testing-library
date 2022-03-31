import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';

describe(
  'Teste se o topo da aplicação contém um conjunto fixo de links de navegação',
  () => {
    it('O primeiro link deve possuir o texto "Home"', () => {
      renderWithRouter(<App />);
      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toBeInTheDocument();
    });

    it('O segundo link deve possuir o texto "About"', () => {
      renderWithRouter(<App />);
      const aboutLink = screen.getByRole('link', { name: /about/i });
      expect(aboutLink).toBeInTheDocument();
    });

    it('O terceiro link deve possuir o texto "Favorite Pokémons"', () => {
      renderWithRouter(<App />);
      const favoritesLink = screen.getByRole('link', { name: /favorite pokémons/i });
      expect(favoritesLink).toBeInTheDocument();
    });
  },
);

describe(
  'Verifica se a navegação do usuário ocorre conforme o esperado',
  () => {
    it(`Teste se a aplicação é redirecionada para a página inicial,
      na URL / ao clicar no link Home da barra de navegação`, () => {
      const { history } = renderWithRouter(<App />);

      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toBeInTheDocument();
      userEvent.click(homeLink);

      const { pathname } = history.location;
      expect(pathname).toBe('/');
    });

    it(`Teste se a aplicação é redirecionada para a página de About, na 
    URL /about, ao clicar no link About da barra de navegação`, () => {
      const { history } = renderWithRouter(<App />);

      const aboutLink = screen.getByRole('link', { name: /about/i });
      expect(aboutLink).toBeInTheDocument();
      userEvent.click(aboutLink);

      const { pathname } = history.location;
      expect(pathname).toBe('/about');
    });

    it(`Teste se a aplicação é redirecionada para a página de Pokémons Favoritados, na 
      URL /favorites, ao clicar no link Favorite Pokémons da barra de navegação`, () => {
      const { history } = renderWithRouter(<App />);

      const favoritesLink = screen.getByRole('link', { name: /favorite pokémons/i });
      expect(favoritesLink).toBeInTheDocument();
      userEvent.click(favoritesLink);

      const { pathname } = history.location;
      expect(pathname).toBe('/favorites');
    });

    it(`Teste se a aplicação é redirecionada para a página Not Found ao 
      entrar em uma URL desconhecida`, () => {
      const { history } = renderWithRouter(<App />);
      history.push('/claudio');
      const notFound = screen.getByRole('heading', { name: /not found/i, level: 2 });
      expect(notFound).toBeDefined();
    });
  },
);
