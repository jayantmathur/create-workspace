@echo off
REM Batch script to install jupyter in a venv using uv and run an R script

setlocal enabledelayedexpansion

REM Configuration
set R_SCRIPT=resources/R/setup.R

echo Creating virtual environment with uv...
uv venv .venv

if errorlevel 1 (
    echo Failed to create virtual environment
    exit /b 1
)

echo Activating virtual environment...
call .venv\Scripts\activate.bat

if errorlevel 1 (
    echo Failed to activate virtual environment
    exit /b 1
)

echo Installing jupyter...
uv pip install jupyter ipykernel

if errorlevel 1 (
    echo Failed to install jupyter
    deactivate
    exit /b 1
)

echo Running R script: %R_SCRIPT%...
Rscript %R_SCRIPT%

if errorlevel 1 (
    echo R script failed with error code !errorlevel!
    deactivate
    exit /b 1
)

echo Removing Python virtual environment .venv...
rmdir /s /q .venv

echo Done!
exit /b 0
