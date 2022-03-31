import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Pokemon } from '../components';
import pokemons from '../data';
import renderWithRouter from './helpers/renderWithRouter';

const pokemon = pokemons[0];

describe('Teste o componente <About.js />', () => {
  it('Teste se é renderizado um card com as informações de determinado pokémon.', () => {
    renderWithRouter(
      <Pokemon pokemon={ pokemon } isFavorite />,
    );

    const pokemonName = screen.getByTestId('pokemon-name');
    expect(pokemonName).toHaveTextContent(pokemon.name);

    const pokemonType = screen.getByTestId('pokemon-type');
    expect(pokemonType).toHaveTextContent(pokemon.type);

    const { averageWeight: { value, measurementUnit } } = pokemon;

    const pokemonWeigth = screen.getByTestId('pokemon-weight');
    expect(pokemonWeigth).toHaveTextContent(
      `Average weight: ${value} ${measurementUnit}`,
    );

    const pokemonImage = screen.getByRole('img', { name: `${pokemon.name} sprite` });
    expect(pokemonImage).toHaveAttribute('alt', `${pokemon.name} sprite`);
    expect(pokemonImage).toHaveAttribute('src', pokemon.image);
  });

  it(`Teste se o card do Pokémon indicado na Pokédex contém um link de navegação para 
    exibir detalhes deste Pokémon.`, () => {
    renderWithRouter(<Pokemon pokemon={ pokemon } isFavorite />);

    const pokemonDetailsLink = screen.getByRole('link', { name: /more details/i });
    expect(pokemonDetailsLink).toBeDefined();
  });

  it(`Teste se o link deve possuir a URL /pokemons/<id>, onde <id> 
    é o id do Pokémon exibido`, () => {
    const { history } = renderWithRouter(<Pokemon pokemon={ pokemon } isFavorite />);
    const pokemonDetailsLink = screen.getByRole('link', { name: /more details/i });

    userEvent.click(pokemonDetailsLink);
    expect(history.location.pathname).toBe(`/pokemons/${pokemon.id}`);
  });

  it(`Teste se ao clicar no link de navegação do Pokémon, é feito o redirecionamento da 
    aplicação para a página de detalhes de Pokémon`, () => {
    renderWithRouter(<Pokemon pokemon={ pokemon } isFavorite />);
    const pokemonDetailsLink = screen.getByRole('link', { name: /more details/i });
    userEvent.click(pokemonDetailsLink);

    const pokemonName = screen.getByTestId('pokemon-name');
    expect(pokemonName).toBeDefined();
  });

  it('Teste se existe um ícone de estrela nos Pokémons favoritados', () => {
    renderWithRouter(<Pokemon pokemon={ pokemon } isFavorite />);

    const favoriteIcon = screen.getByRole(
      'img', { name: `${pokemon.name} is marked as favorite` },
    );
    expect(favoriteIcon).toBeDefined();
    expect(favoriteIcon).toHaveAttribute('src', '/star-icon.svg');
  });
});
