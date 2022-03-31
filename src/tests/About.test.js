import { screen } from '@testing-library/react';
import React from 'react';
import About from '../components/About';
import renderWithRouter from './helpers/renderWithRouter';

describe('Teste o componente <About.js />', () => {
  it('Teste se a página contém as informações sobre a Pokédex', () => {
    renderWithRouter(<About />);
    const paragraphOne = screen.getByText(/This application simulates a Pokédex/i);
    const paragraphTwo = screen.getByText(/One can filter Pokémons by type/i);

    expect(paragraphOne).toBeDefined();
    expect(paragraphTwo).toBeDefined();
  });

  it('Teste se a página contém um heading h2 com o texto About Pokédex', () => {
    renderWithRouter(<About />);
    const heading = screen.getByRole('heading', { name: /about pokédex/i, level: 2 });

    expect(heading).toBeDefined();
  });

  it('Teste se a página contém dois parágrafos com texto sobre a Pokédex', () => {
    renderWithRouter(<About />);
    const paragraphOne = screen.getByText(/This application simulates a Pokédex/i);
    const paragraphTwo = screen.getByText(/One can filter Pokémons by type/i);
    const paragraphs = [paragraphOne, paragraphTwo];

    expect(paragraphs).toHaveLength(2);
  });

  it(`Teste se a página contém a seguinte imagem de uma Pokédex:
      https://cdn2.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png`, () => {
    renderWithRouter(<About />);
    const pokemonPicture = screen.getByAltText(/Pokédex/i);

    expect(pokemonPicture).toBeInTheDocument();
    expect(pokemonPicture).toHaveAttribute('src', 'https://cdn2.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png');
  });
});
