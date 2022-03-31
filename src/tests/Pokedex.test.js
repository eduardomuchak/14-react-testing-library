import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Pokedex } from '../components';
import pokemons from '../data';
import renderWithRouter from './helpers/renderWithRouter';

describe(
  'Teste o componente <Pokedex.js />', () => {
    const isPokemonFavoriteById = () => {
      let favoritesPokemonObject = {};
      pokemons.forEach((pokemon) => {
        favoritesPokemonObject = { ...favoritesPokemonObject, [pokemon.id]: false };
      });
      return favoritesPokemonObject;
    };

    // Código retirado da linha 38 do componente Pokedex.js deste projeto
    // Função que retorna um array com os tipos de Pokemon
    const pokemonTypes = [...new Set(
      pokemons.reduce((types, { type }) => [...types, type], []),
    )];

    // Precisei criar esta constante para corrigir erro de lint.
    const typeButtonTestId = 'pokemon-type-button';

    it('Teste se página contém um heading h2 com o texto Encountered pokémons', () => {
      renderWithRouter(
        <Pokedex
          isPokemonFavoriteById={ isPokemonFavoriteById() }
          pokemons={ pokemons }
        />,
      );
      const title = screen.getByRole('heading', { name: /encountered/i, level: 2 });
      expect(title).toBeDefined();
    });

    it(`Teste se é exibido o próximo Pokémon da lista quando o botão Próximo
      pokémon é clicado`, () => {
      renderWithRouter(
        <Pokedex
          isPokemonFavoriteById={ isPokemonFavoriteById() }
          pokemons={ pokemons }
        />,
      );
      const nextPokemonButton = screen.getByRole('button', { name: /próximo pokémon/i });
      expect(nextPokemonButton).toBeDefined();

      pokemons.forEach((pokemon) => {
        const pokemonName = screen.getByText(new RegExp(pokemon.name, 'i'));
        expect(pokemonName).toBeInTheDocument();

        userEvent.click(nextPokemonButton);
      });
    });

    it(`O primeiro Pokémon da lista deve ser mostrado ao clicar no botão, 
    se estiver no último Pokémon da lista`, () => {
      renderWithRouter(
        <Pokedex
          isPokemonFavoriteById={ isPokemonFavoriteById() }
          pokemons={ pokemons }
        />,
      );
      const nextPokemonButton = screen.getByRole('button', { name: /próximo pokémon/i });
      expect(nextPokemonButton).toBeDefined();

      for (let actualPokemon = 0;
        actualPokemon < pokemons.length - 1;
        actualPokemon += 1) {
        userEvent.click(nextPokemonButton);
      }

      const lastPokemonName = screen.getByText(
        new RegExp(pokemons[pokemons.length - 1].name, 'i'),
      );
      expect(lastPokemonName).toBeDefined();

      userEvent.click(nextPokemonButton);
      const firstPokemonName = screen.getByText(new RegExp(pokemons[0].name, 'i'));
      expect(firstPokemonName).toBeDefined();
    });

    it('Teste se é mostrado apenas um Pokémon por vez', () => {
      renderWithRouter(
        <Pokedex
          isPokemonFavoriteById={ isPokemonFavoriteById() }
          pokemons={ pokemons }
        />,
      );
      const nextPokemonButton = screen.getByRole('button', { name: /próximo pokémon/i });
      expect(nextPokemonButton).toBeDefined();

      const pokemonTestIds = screen.getAllByTestId(/pokemon-name/i);
      expect(pokemonTestIds).toBeDefined();
      expect(pokemonTestIds).toHaveLength(1);

      userEvent.click(nextPokemonButton);
      expect(pokemonTestIds).toBeDefined();
      expect(pokemonTestIds).toHaveLength(1);
    });

    it('Teste se a Pokédex tem os botões de filtro', () => {
      renderWithRouter(
        <Pokedex
          isPokemonFavoriteById={ isPokemonFavoriteById() }
          pokemons={ pokemons }
        />,
      );
      const filterButtons = screen.getAllByTestId(typeButtonTestId);
      expect(filterButtons).toHaveLength(pokemonTypes.length);
    });

    it(`A partir da seleção de um botão de tipo, a Pokédex deve circular 
      somente pelos pokémons daquele tipo`, () => {
      renderWithRouter(
        <Pokedex
          isPokemonFavoriteById={ isPokemonFavoriteById() }
          pokemons={ pokemons }
        />,
      );
      const filterButtons = screen.getAllByTestId(typeButtonTestId);
      filterButtons.forEach((button, index) => {
        expect(button).toHaveTextContent(pokemonTypes[index]);
        userEvent.click(button);

        const filteredPokemonsByType = pokemons.filter(
          (pokemon) => pokemon.type === button.textContent,
        );
        const nextPokeButton = screen.getByRole('button', { name: /próximo pokémon/i });
        expect(nextPokeButton).toBeDefined();

        filteredPokemonsByType.forEach((pokemon) => {
          const pokemonTestId = screen.getByTestId('pokemon-name');
          expect(pokemonTestId).toHaveTextContent(pokemon.name);
          userEvent.click(nextPokeButton);
        });
      });
    });

    it('O botão All precisa estar sempre visível', () => {
      renderWithRouter(
        <Pokedex
          isPokemonFavoriteById={ isPokemonFavoriteById() }
          pokemons={ pokemons }
        />,
      );
      const allTypesButton = screen.getByRole('button', { name: /all/i });
      expect(allTypesButton).toBeVisible();

      const nextPokemonButton = screen.getByRole('button', { name: /próximo pokémon/i });
      expect(nextPokemonButton).toBeDefined();

      userEvent.click(nextPokemonButton);
      expect(allTypesButton).toBeVisible();
    });

    it('Teste se a Pokédex contém um botão para resetar o filtro', () => {
      renderWithRouter(
        <Pokedex
          isPokemonFavoriteById={ isPokemonFavoriteById() }
          pokemons={ pokemons }
        />,
      );
      const allTypesButton = screen.getByRole('button', { name: /all/i });
      expect(allTypesButton).toBeDefined();

      userEvent.click(allTypesButton);
      const typesButtons = screen.findAllByTestId(typeButtonTestId);
      expect(allTypesButton).not.toHaveAttribute(typesButtons);
    });
  },
);
