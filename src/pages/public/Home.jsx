import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IconSearch,
  IconShip,
  IconArrowRight,
  IconCreditCard,
  IconMessage2,
  IconShieldCheck,
  IconBuildingStore,
  IconBolt,
  IconBox
} from '@tabler/icons-react';
import ContainerFillGraphic from '../../components/ContainerFillGraphic';
import ContainerCard from '../../components/ContainerCard';
import api from '../../services/api';
import { toArray } from '../../services/response';

export default function Home() {
  const [featuredContainers, setFeaturedContainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/containers/search');
        setFeaturedContainers(toArray(res.data).slice(0, 3));
      } catch (err) {
        console.warn('Could not load containers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section: Dark Industrial Port Terminal with Container-Fill Illustration */}
      <section className="bg-port-dark text-port-light border-b border-port-gray/40 py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 text-left space-y-5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#16253B] border border-port-gray/40 rounded-[2px] text-[11px] font-mono text-port-orange tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-[1px] bg-port-orange animate-pulse"></span>
              ISO 668 Fractional Capacity Exchange
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white uppercase leading-[1.08]">
              Book Only The <span className="text-port-orange">Container Space</span> You Need.
            </h1>

            <p className="text-sm sm:text-base text-port-light/80 max-w-xl font-body leading-relaxed">
              Stop paying for empty 20ft and 40ft boxes. Connect with vetted sea, rail, road, and air carriers who list verified unused CBM space on scheduled multimodal voyages.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/trader/search"
                className="px-5 py-3 bg-port-orange hover:bg-port-orangeHover text-white font-heading font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-sm flex items-center gap-2 transition-colors"
              >
                <IconSearch size={16} />
                <span>Search Live Container Space</span>
              </Link>
              <Link
                to="/register/provider"
                className="px-5 py-3 border border-port-gray hover:bg-[#16253B] text-port-light font-heading font-semibold text-xs uppercase tracking-wider rounded-[2px] flex items-center gap-2 transition-colors"
              >
                <IconBuildingStore size={16} />
                <span>List Container as Carrier</span>
              </Link>
            </div>

            {/* Micro manifest specs */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-port-gray/30 text-left font-mono text-xs">
              <div>
                <span className="text-port-grayLight block text-[10px] uppercase">Min Allocation</span>
                <span className="font-bold text-white text-sm">1.0 CBM</span>
              </div>
              <div>
                <span className="text-port-grayLight block text-[10px] uppercase">Carrier Vetting</span>
                <span className="font-bold text-port-teal text-sm">100% Admin Vetted</span>
              </div>
              <div>
                <span className="text-port-grayLight block text-[10px] uppercase">Live Brokerage</span>
                <span className="font-bold text-white text-sm">STOMP Telemetry</span>
              </div>
            </div>
          </div>

          {/* Container Fill Visualization Graphic */}
          <div className="lg:col-span-5">
            <ContainerFillGraphic totalCbm={68} occupiedCbm={43.5} />
            <div className="mt-2 text-center text-[10px] font-mono text-port-grayLight">
              Live Container Silhouette telemetry showing dynamic remaining CBM slots
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Manifest Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-8">
          <span className="text-xs font-mono uppercase text-port-gray tracking-wider block mb-1">
            Operational Blueprint
          </span>
          <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-port-dark">
            How CargoShare Functions in 3 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Step 1 */}
          <div className="bg-white border border-[#D8D1C3] p-5 rounded-[2px] relative shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="font-heading font-black text-2xl text-port-dark/20 font-mono">
                01
              </span>
              <span className="p-2 bg-[#FAF8F5] border border-port-gray/30 rounded-[2px] text-port-dark">
                <IconSearch size={20} />
              </span>
            </div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-port-dark mb-2">
              1. Search Active Manifests
            </h3>
            <p className="text-xs text-port-gray leading-relaxed font-body">
              Filter by origin, destination port, transit mode (Sea, Rail, Road, Air), and required CBM volume. Review match scores and departure schedules.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-[#D8D1C3] p-5 rounded-[2px] relative shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="font-heading font-black text-2xl text-port-dark/20 font-mono">
                02
              </span>
              <span className="p-2 bg-[#FAF8F5] border border-port-gray/30 rounded-[2px] text-port-orange">
                <IconBox size={20} />
              </span>
            </div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-port-dark mb-2">
              2. Reserve Fractional Space
            </h3>
            <p className="text-xs text-port-gray leading-relaxed font-body">
              Specify your crated volume. Live client and server validation prevents overselling beyond real available container capacity.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-[#D8D1C3] p-5 rounded-[2px] relative shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="font-heading font-black text-2xl text-port-dark/20 font-mono">
                03
              </span>
              <span className="p-2 bg-[#FAF8F5] border border-port-gray/30 rounded-[2px] text-port-teal">
                <IconCreditCard size={20} />
              </span>
            </div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-port-dark mb-2">
              3. Settle Online & Real-time Chat
            </h3>
            <p className="text-xs text-port-gray leading-relaxed font-body">
              Authorize test payment via integrated checkout. Instantly coordinate customs declarations, bill of lading, and pallet loading via STOMP chat.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Ledger Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D8D1C3]">
          <div>
            <span className="text-xs font-mono uppercase text-port-gray tracking-wider block">
              Live Ledger Stream
            </span>
            <h2 className="font-heading font-black text-xl uppercase tracking-tight text-port-dark">
              Available Container Capacity
            </h2>
          </div>
          <Link
            to="/trader/search"
            className="text-xs font-heading font-bold text-port-orange hover:text-port-orangeHover flex items-center gap-1 uppercase tracking-wider"
          >
            <span>View All Departures</span>
            <IconArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-port-gray">
            Querying active container manifests...
          </div>
        ) : (
          <div>
            {featuredContainers.map((container) => (
              <ContainerCard key={container.id} container={container} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
