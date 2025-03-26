"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getOwnedRestaurants } from '@/app/api/user';
import { getUserInfo } from '@/app/api/user';  // Function to fetch user's info, can be added to user.ts API


