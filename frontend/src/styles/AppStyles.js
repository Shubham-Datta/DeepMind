import styled from 'styled-components';

export const AppContainer = styled.div`
  font-size: 1.5rem;
  position: relative;
  height: 100vh;
  width: 100vw;

  h1 {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  section:nth-child(odd) {
    color: white;
    background-color: black;
  }
`;
