cmake_minimum_required(VERSION 3.14) 

set(PROJECT_VERSION 0.0.0)
set(PROJECT_NAME Musicore-${PROJECT_VERSION})

add_subdirectory(thirdparty)

project(${PROJECT_NAME}) 
add_executable(${PROJECT_NAME} src/main.cpp) 

# Linking Libraries
target_link_libraries(${PROJECT_NAME} PRIVATE SFML)