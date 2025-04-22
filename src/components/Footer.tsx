import styled from 'styled-components';

const FooterContainer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  margin-top: auto;
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.primary};
  margin-left: 5px;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <p>
        My Life Calendar &copy; {new Date().getFullYear()} | Inspired by
        <FooterLink 
          href="https://lifeweeks.app" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          {" "}lifeweeks.app
        </FooterLink>
      </p>
    </FooterContainer>
  );
};

export default Footer;