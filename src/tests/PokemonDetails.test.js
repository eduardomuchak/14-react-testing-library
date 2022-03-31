import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../App';
import { PokemonDetails } from '../components';
import pokemons from '../data';
import { updateFavoritePokemons } from '../services/pokedexService';
import renderWithRouter from './helpers/renderWithRouter';

describe('Teste o componente <PokemonDetails.js />', () => {
  const pokemon = pokemons[0];
  const isPokemonFavorite = { 25: false };
  const pokemonId = { params: { id: '25' } };

  describe(`Teste se as informações detalhadas do Pokémon selecionado são mostradas 
    na tela`,
  () => {
    it('A página deve conter um texto <name> Details, onde <name> é o nome do Pokémon',
      () => {
        renderWithRouter(
          <PokemonDetails
            isPokemonFavoriteById={ isPokemonFavorite }
            match={ pokemonId }
            pokemons={ pokemons }
            onUpdateFavoritePokemons={ updateFavoritePokemons }
          />,
        );
        const pokemonTitle = screen.getByRole(
          'heading', { name: `${pokemon.name} Details`, level: 2 },
        );
        expect(pokemonTitle).toBeDefined();
      });

    it('Não deve existir o link de navegação para os detalhes do Pokémon selecionado',
      () => {
        renderWithRouter(
          <PokemonDetails
            isPokemonFavoriteById={ isPokemonFavorite }
            match={ pokemonId }
            pokemons={ pokemons }
            onUpdateFavoritePokemons={ updateFavoritePokemons }
          />,
        );
        const pokemonDetailsLink = screen.queryByRole('link', { name: /more details/i });
        expect(pokemonDetailsLink).toBeNull();
      });

    it('A seção de detalhes deve conter um heading h2 com o texto Summary',
      () => {
        renderWithRouter(
          <PokemonDetails
            isPokemonFavoriteById={ isPokemonFavorite }
            match={ pokemonId }
            pokemons={ pokemons }
            onUpdateFavoritePokemons={ updateFavoritePokemons }
          />,
        );
        const pokemonSummary = screen.getByRole('heading', { name: /summary/i });
        expect(pokemonSummary).toBeDefined();
      });

    it(`A seção de detalhes deve conter um parágrafo com o resumo do Pokémon específico
        sendo visualizado`,
    () => {
      renderWithRouter(
        <PokemonDetails
          isPokemonFavoriteById={ isPokemonFavorite }
          match={ pokemonId }
          pokemons={ pokemons }
          onUpdateFavoritePokemons={ updateFavoritePokemons }
        />,
      );
      const pokemonInfo = screen.getByText(pokemon.summary);
      expect(pokemonInfo).toBeDefined();
    });
  });

  describe(
    'Teste se existe na página uma seção com mapas contendo as localizações do pokémon',
    () => {
      it(`Na seção de detalhes deverá existir um heading h2 com o texto Game Locations
        of <name>; onde <name> é o nome do Pokémon exibido`, () => {
        renderWithRouter(
          <PokemonDetails
            isPokemonFavoriteById={ isPokemonFavorite }
            match={ pokemonId }
            pokemons={ pokemons }
            onUpdateFavoritePokemons={ updateFavoritePokemons }
          />,
        );
        const gameLocationsTitle = screen.getByRole(
          'heading', { name: `Game Locations of ${pokemon.name}`, level: 2 },
        );
        expect(gameLocationsTitle).toBeDefined();
      });

      it('Todas as localizações do Pokémon devem ser mostradas na seção de detalhes',
        () => {
          renderWithRouter(
            <PokemonDetails
              isPokemonFavoriteById={ isPokemonFavorite }
              match={ pokemonId }
              pokemons={ pokemons }
              onUpdateFavoritePokemons={ updateFavoritePokemons }
            />,
          );
          const locationImages = screen.getAllByRole(
            'img', { name: `${pokemon.name} location` },
          );
          expect(locationImages).toBeDefined();
        });

      it(`Devem ser exibidos, o nome da localização e uma imagem do mapa em cada
        localização`,
      () => {
        renderWithRouter(
          <PokemonDetails
            isPokemonFavoriteById={ isPokemonFavorite }
            match={ pokemonId }
            pokemons={ pokemons }
            onUpdateFavoritePokemons={ updateFavoritePokemons }
          />,
        );
        pokemon.foundAt.forEach(({ location }) => {
          const pokemonLocation = screen.getAllByText(location);
          expect(pokemonLocation).toBeDefined();
        });
      });

      it('A imagem da localização deve ter um atributo src com a URL da localização',
        () => {
          renderWithRouter(
            <PokemonDetails
              isPokemonFavoriteById={ isPokemonFavorite }
              match={ pokemonId }
              pokemons={ pokemons }
              onUpdateFavoritePokemons={ updateFavoritePokemons }
            />,
          );

          const locationImages = screen.getAllByRole(
            'img', { name: `${pokemon.name} location` },
          );
          pokemon.foundAt.forEach(({ map }, index) => {
            expect(locationImages[index].src).toBe(map);
          });
        });

      it(`A imagem da localização deve ter um atributo alt com o texto <name> location, 
        onde <name> é o nome do Pokémon`,
      () => {
        renderWithRouter(
          <PokemonDetails
            isPokemonFavoriteById={ isPokemonFavorite }
            match={ pokemonId }
            pokemons={ pokemons }
            onUpdateFavoritePokemons={ updateFavoritePokemons }
          />,
        );
        const locationImages = screen.getAllByRole(
          'img', { name: `${pokemon.name} location` },
        );
        pokemon.foundAt.forEach((_location, index) => {
          expect(locationImages[index].alt).toBe(`${pokemon.name} location`);
        });
      });
    },
    describe('Teste se o usuário pode favoritar um pokémon através da página de detalhes',
      () => {
        it('A página deve exibir um checkbox que permite favoritar o Pokémon', () => {
          renderWithRouter(
            <PokemonDetails
              isPokemonFavoriteById={ isPokemonFavorite }
              match={ pokemonId }
              pokemons={ pokemons }
              onUpdateFavoritePokemons={ updateFavoritePokemons }
            />,
          );
          const favoriteCheckbox = screen.getByRole(
            'checkbox', { name: /pokémon favoritado?/i },
          );
          expect(favoriteCheckbox).toBeDefined();
        });

        it(`Cliques alternados no checkbox devem adicionar e remover respectivamente o 
          Pokémon da lista de favoritos`, () => {
          const { history } = renderWithRouter(<App />);
          history.push('/pokemons/25');

          const favoriteCheckbox = screen.getByRole(
            'checkbox', { name: /pokémon favoritado/i },
          );

          expect(favoriteCheckbox).not.toBeChecked();
          userEvent.click(favoriteCheckbox);

          const favoriteIcon = screen.getByRole(
            'img', { name: `${pokemon.name} is marked as favorite` },
          );
          expect(favoriteIcon).toBeDefined();

          userEvent.click(favoriteCheckbox);
          expect(favoriteIcon).not.toBeInTheDocument();
        });

        it('O label do checkbox deve conter o texto "Pokémon favoritado?"', () => {
          renderWithRouter(
            <PokemonDetails
              isPokemonFavoriteById={ isPokemonFavorite }
              match={ pokemonId }
              pokemons={ pokemons }
              onUpdateFavoritePokemons={ updateFavoritePokemons }
            />,
          );

          const favoriteCheckbox = screen.getByLabelText(/pokémon favoritado\?/i);
          expect(favoriteCheckbox).toBeDefined();
        });
      }),
  );
});
