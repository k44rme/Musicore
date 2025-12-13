#include <SFML/Graphics.hpp>

#include "interface.h"

int main()
{
    sf::RenderWindow window(sf::VideoMode(960, 540), "Musicore");

    while (window.isOpen())
    {
        sf::Event event;
        while (window.pollEvent(event))
        {
            if (event.type == sf::Event::Closed)
                window.close();
        }

        window.clear();

        DrawInterface(window);

        window.display();
    }

    return 0;
}
